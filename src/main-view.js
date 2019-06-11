'use strict';

import React from 'react';

class MainView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			roomName: ''
		};
	}

	render() {
		return (
			<div>
				<div>
					<h1>Welcome!</h1>
					<p>To begin, enter a room name.</p>
					<p>If this room does not exist, it will be created.</p>
					<p>You can bypass this screen by appending the room name to the end of the Himawari URL, like so:</p>
					<p><b>https://himawari.ml/RoomName</b></p>
				</div>
				<div>
					<label>
                    Room Name:
						<input type="text" value={this.state.roomName} onChange={this.handleOnChange.bind(this)} />
					</label>
					<button onClick={() => this.handleJoin(this.state.roomName)}>Join or Create</button>
				</div>
			</div>
		);
	}

	handleOnChange(event) {
		const {target} = event;
		this.setState({
			roomName: target.value
		});
	}

	handleJoin(event) {
		this.props.onJoin(this.state.roomName);
	}
}

export default MainView;
