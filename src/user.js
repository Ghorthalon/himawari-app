'use strict';

import React from 'react';

class User extends React.Component {
	constructor(props) {
		super(props);
		this.shouldUpdate = true;
		this.state = {
			sound: null,
			panner: null,
			volume: 100,
			pan: 50
		};
	}

	shouldComponentUpdate() {
		return this.shouldUpdate;
	}

	componentDidMount() {

	}

	render() {
		return (
			<div>
				<div>User: {this.props.name}</div>
				{this.renderHTMLPlayer()}
			</div>
		);
	}

	getVideoRef(input) {
		if (!input || this.state.sound) {
			return;
		}

		input.srcObject = this.props.stream;
		input.play();
	}

	renderHTMLPlayer() {
		return (
			<audio autoplay controls ref={this.getVideoRef.bind(this)}>
			</audio>
		);
	}
}

export default User;
