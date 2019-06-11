'use strict';

import React from 'react';

class ReadyView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: this.props.name
		};
	}

	render() {
		return (
			<div>
				<p>Ready to join conference</p>
				<label>
                    Join as:
					<input type="text" value={this.state.name} onChange={this.hhandleOnChange.bind(this)}></input>
				</label>
				<button onClick={() => this.props.onClick(this.state.name, this.props.roomID)}>Join {this.props.roomID}</button>
			</div>
		);
	}

	hhandleOnChange(event) {
		const {target} = event;
		this.setState({
			name: target.value
		});
	}
}

export default ReadyView;
