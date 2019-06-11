'use strict';

import React from 'react';

class MessageInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: ''
		};
	}

	render() {
		return (
			<div>
				<label>
                    message:
					<input type="text" value={this.state.message} onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} />
				</label>
			</div>
		);
	}

	handleChange(event) {
		const {target} = event;
		this.setState({
			message: target.value
		});
	}

	handleKeyDown(event) {
		if (event.keyCode == 13) {
			this.props.onEnter(this.state.message);
			this.setState({
				message: ''
			});
		}
	}
}

export default MessageInput;
