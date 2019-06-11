'use strict';

import React from 'react';
import Peer from 'peerjs';
import sono from 'sono';
import UUID from 'uuid/v1';
import SDPTransform from 'sdp-transform';
import Microphone from './microphone';
import User from './user';
import MessageLog from './message-log';
import MessageInput from './message-input';
import MicControls from './mic-controls';
import Config from './config';
import AudioSettingsView from './audio-settings-view';
import PeerConfig from './data/config.json';

class RoomView extends React.Component {
	constructor(props) {
		super(props);
		this.active = false;
		this.io = props.socket;
		this.state = {
			users: [],
			messages: [],
			mic: props.mic,
			stream: props.stream,
			showAudioSettings: props.created,
			constraints: this.props.constraints
		};
		this.peer = new Peer(this.props.uuid, PeerConfig);
		this.peer.on('open', id => {
			this.addMessage('Connected');
			this.addMessage(`Your ID: ${id}`);
			this.setupMic();
		});
		this.sfx = {
			callAnswer: sono.create('/sounds/callAnswer.wav'),
			callHangup: sono.create('/sounds/callHangup.wav'),
			callIncoming: sono.create('/sounds/callIncoming.wav'),
			callOutgoing: sono.create('/sounds/callOutgoing.wav'),
			error: sono.create('/sounds/error.wav'),
			msgOther: sono.create('/sounds/msgOther.wav'),
			msgSystem: sono.create('/sounds/msgSystem.wav'),
			msgYou: sono.create('/sounds/msgYou.wav')
		};
		this.setupEvents();
	}

	setupMic() {
		const mic = Microphone({audio: this.state.constraints}, stream => {
			this.onMedia(mic, stream);
		});
		mic.connect();
	}

	onMedia(mic, stream) {
		this.setState({
			mic,
			stream
		});
		this.callInitial();
	}

	callInitial() {
		if (this.props.initialUsers) {
			this.props.initialUsers.forEach(user => {
				this.callUser(user);
			});
		}
	}

	setupEvents() {
		this.io.on('call', data => {
			this.callUser(data.userID);
		});
		this.io.on('message', data => this.receiveMessage(data));
		this.io.on('leave', id => this.removeUser(id));
		this.peer.on('call', call => {
			this.addMessage(`Received call from ${call.metadata.name}`);
			this.sfx.callIncoming.play();
			call.answer(this.state.stream);
			const {userID} = call.metadata;
			call.on('error', err => {
				this.sfx.callIncoming.stop();
				this.sfx.error.play();
				this.addMessage('Error accepting call');
			});
			call.on('stream', remoteStream => {
				this.addMessage('Received stream');
				this.sfx.callIncoming.stop();
				this.sfx.callAnswer.play();
				const streams = this.state.users;
				streams.push({
					userID,
					remoteStream,
					name: call.metadata.name,
					peer: call
				});
				this.setState({
					users: streams
				});
			});
		});
	}

	render() {
		if (this.state.showAudioSettings) {
			return (
				<AudioSettingsView onSubmit={this.handleAudioSettings.bind(this)}></AudioSettingsView>
			);
		}

		return (
			<div>
				<h1>{this.props.name}@{this.props.id}</h1>
				<div aria-live="polite">
					<h2>Message Log</h2>
					{this.buildMessageLog()}
				</div>
				<MessageInput onEnter={message => this.sendMessage(message)} />
				<div>
					{this.buildUserList()}
				</div>
				<div>
					<MicControls constraints={this.state.constraints} mic={this.state.stream}></MicControls>
				</div>
			</div>
		);
	}

	buildUserList() {
		return this.state.users.map(user => {
			return <User name={user.name} id={user.userID} stream={user.remoteStream}></User>;
		});
	}

	callUser(user) {
		if (user.userID == this.props.uuid) {
			return;
		}

		this.addMessage(`Calling ${user.name}`);
		this.sfx.callOutgoing.play();
		const call = this.peer.call(user.userID, this.state.stream, {
			metadata: {
				userID: this.props.uuid,
				name: this.props.name
			}
		});
		call.on('error', err => {
			this.sfx.callOutgoing.stop();
			this.addMessage('Error calling');
			this.sfx.error.play();
		});
		call.on('stream', remoteStream => {
			this.addMessage('Received stream');
			this.sfx.callOutgoing.stop();
			this.sfx.callAnswer.play();
			const streams = this.state.users;
			streams.push({
				userID: user.userID,
				remoteStream,
				name: user.name,
				peer: call
			});
			this.setState({
				users: streams
			});
		});
	}

	buildMessageLog() {
		return this.state.messages.map(item => {
			return <div>{item}</div>;
		});
	}

	addMessage(message, system = false) {
		const {messages} = this.state;
		const time = new Date().toLocaleTimeString();
		messages.push(`${time}: ${message}`);
		this.setState({
			messages
		});
		if (system) {
			this.sfx.msgSystem.play();
		}
	}

	sendMessage(message) {
		this.io.emit('message', message);
	}

	receiveMessage(data) {
		const message = `${data.name} : ${data.message}`;
		if (data.name !== this.props.name) {
			this.sfx.msgOther.play();
		} else {
			this.sfx.msgYou.play();
		}

		this.addMessage(message);
	}

	removeUser(id) {
		// Const user = this.state.users.find(item => item.userID == id);
		// user.peer.destroy();
		const {users} = this.state;
		const newUsers = users.filter(item => item.userID !== id);
		this.setState({
			users: newUsers
		});
		this.sfx.callHangup.play();
	}

	sdpTransform(sdp) {
		const highQ = Config.get('high-quality');
		if (!highQ) {
			return sdp;
		}

		let opusId = 111; // Default to what WebRTC was sending as of April 2019
		const lines = sdp.split('\r\n');
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (line.includes('rtpmap:')) {
				// Remove any rtpmap that isn't opus
				if (!line.includes('opus')) {
					i++;
					continue;
				}

				const parts = line.split('=');
				const matches = parts[1].match(':\\d{1, 3}'); // Match :XXX id
				if (matches) {
					opusId = matches[0].substring(1);
				}

				// Make sure we get the trailing /2 for stereo
				const parts2 = parts[1].split('/');
				if (!parts2.includes('2')) {
					parts2.push('2');
				}

				parts[1] = parts2.join('/');
				lines[i] = parts.join('=');
			}

			// Fmtp settings
			if (line.includes(`fmtp:${opusId}`)) {
				const parts = line.split(' ');
				const parts2 = parts[1].split(';');
				let key = 'stereo=1';
				if (!parts[1].includes(key)) {
					parts2.push(key);
				}

				key = 'sprop-stereo=1';
				if (!parts[1].includes(key)) {
					parts2.push(key);
				}

				parts[1] = parts2.join(';');
				lines[i] = parts.join(' ');
			}
		}

		return lines.join('\r\n');
	}

	handleAudioSettings(state) {
		this.setState({
			showAudioSettings: false
		});
		const constraints = state;
		if (constraints.stereo) {
			constraints.channelCount = 2;
		}

		this.io.emit('audioConstraints', constraints);
		const mic = Microphone({audio: constraints}, stream => {
			this.setState({
				stream,
				constraints,
				mic
			});
		});
		mic.connect();
	}
}

export default RoomView;
