'use strict';

import React from 'react';
import io from 'socket.io-client';
import UUID from 'uuid/v1';
import RoomView from './room-view';
import MainView from './main-view';
import Microphone from './microphone';
import Config from './config';
import ReadyView from './ready-view';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.io = io();
		this.state = {
			stage: 0,
			roomID: null,
			uuid: UUID(),
			name: '',
			mic: {},
			justCreatedRoom: false,
			constraints: {}
		};
		this.setupEvents();
	}

	setupEvents() {
		this.io.on('join', data => {
			this.onJoined(data);
		});
	}

	componentDidMount() {
		// Ask for microphone just to make sure we have it. Without it, there's no point in continuing.
		const mic = Microphone({audio: true}, stream => {
			this.onMedia(mic, stream);
		});
		mic.connect();
	}

	onMedia(mic, stream) {
		this.setState({
			stream,
			mic
		});
		const roomID = location.pathname;
		this.joinRoom(roomID);
	}

	render() {
		switch (this.state.stage) {
			case 0:
				return <div>Loading...</div>;
				break;
			case 1:
				return <MainView onJoin={this.joinRoom.bind(this)}></MainView>;
				break;
			case 2:
				return <RoomView name={this.state.name} created={this.state.justCreatedRoom} initialUsers={this.state.initialUsers} id={this.state.roomID} uuid={this.state.uuid} constraints={this.state.constraints} socket={this.io}></RoomView>;
				break;
			case 3:
				return <ReadyView name={this.state.name} roomID={this.state.roomID} onClick={this.onJoinClick.bind(this)}></ReadyView>;
				break;
			default:
				return <div><b>An error has occurred</b></div>;
		}
	}

	joinRoom(id) {
		const roomID = id.replace(/\//g, '');
		console.log(`Got roomID: ${roomID}`);
		if (roomID === '/' || roomID === '') {
			this.setState({
				stage: 1
			});
			return;
		}

		this.setState({
			roomID,
			stage: 3
		});
	}

	onJoinClick(name, roomID) {
		this.io.emit('join', {
			roomID: this.state.roomID,
			userID: this.state.uuid,
			name
		});
	}

	onJoined(data) {
		this.setState({
			stage: 2,
			name: data.name,
			initialUsers: data.users,
			justCreatedRoom: data.created,
			constraints: data.constraints
		});
	}
}

export default App;
