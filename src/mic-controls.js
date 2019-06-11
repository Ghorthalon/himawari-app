'use strict';

import React from 'react';

class MicControls extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			muted: false,
			noiseSuppression: true,
			echoCancellation: true
		};
	}

	render() {
		return (
			<div>
				<h2>Mic controls</h2>
				<div>
					<button onClick={() => this.handleMuteClick()}>{this.state.muted ? 'Unmute' : 'Mute'}</button>
					<button onClick={() => this.handleNoiseSuppressionClick()}>{this.state.noiseSuppression ? 'Stop suppressing noise' : 'Suppress Noise'}</button>
					<button onClick={() => this.handleEchoCancellationClick()}>{this.state.echoCancellation ? 'Don\'t cancel echos' : 'Cancel Echos'}</button>
				</div>
			</div>
		);
	}

	handleMuteClick() {
		const muted = !this.state.muted;
		this.setState({
			muted
		});
		if (muted) {
			this.props.mic.getAudioTracks()[0].enabled = false;
		} else {
			this.props.mic.getAudioTracks()[0].enabled = true;
		}
	}

	handleNoiseSuppressionClick() {
		const suppressed = !this.state.noiseSuppression;
		this.setState({
			noiseSuppression: suppressed
		});
		this.doApplyConstraints();
	}

	handleEchoCancellationClick() {
		const cancelled = !this.state.echoCancellation;
		this.setState({
			echoCancellation: cancelled
		});
		this.doApplyConstraints();
	}

	doApplyConstraints() {
		this.props.mic.getAudioTracks()[0].applyConstraints({
			echoCancellation: this.state.echoCancellation,
			noiseSuppression: this.state.noiseSuppression,
			channelCount: this.props.constraints.channelCount
		});
	}
}

export default MicControls;
