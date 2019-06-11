'use strict';

import React from 'react';

class MessageLog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: []
		};
	}

	render() {
		return (
			<div>
				<h2>Message Log</h2>
				{this.state.messages.map(item => {
					return <p>{item}</p>;
				})}
			</div>
		);
	}

	addMessage(message) {
		const {messages} = this.state;
		messages.push(message);
		this.setState({
			messages
		});
	}
}

export default MessageLog;
