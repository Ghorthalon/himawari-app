'use strict';

import React from 'react';

class AudioSettingsView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			automaticGainControl: true,
			echoCancellation: true,
			noiseSuppression: true,
			stereo: false
		};
	}

	render() {
		return (
			<div>
				<h1>Audio Settings</h1>
				<label>
                    Automatic Gain Control:
					<input type="checkbox" checked={this.state.automaticGainControl} onChange={this.handleAGC.bind(this)}/>
				</label>
				<label>
                    Echo Cancellation:
					<input type="checkbox" checked={this.state.echoCancellation} onChange={this.handleEchoCancellation.bind(this)}/>
				</label>
				<label>
                    Noise Suppression:
					<input type="checkbox" checked={this.state.noiseSuppression} onChange={this.handleNoiseSuppression.bind(this)}/>
				</label>
				<label>
                    Stereo:
					<input type="checkbox" checked={this.state.stereo} onChange={this.handleStereo.bind(this)}/>
				</label>
				<button onClick={() => this.props.onSubmit(this.state)}>Set</button>
			</div>
		);
	}

	handleAGC(event) {
		const {target} = event;
		this.setState({
			automaticGainControl: target.checked
		});
	}

	handleEchoCancellation(event) {
		const {target} = event;
		this.setState({
			echoCancellation: target.checked
		});
	}

	handleNoiseSuppression(event) {
		const {target} = event;
		this.setState({
			noiseSuppression: target.checked
		});
	}

	handleStereo(event) {
		const {target} = event;
		this.setState({
			stereo: target.checked
		});
	}
}

export default AudioSettingsView;
