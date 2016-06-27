import React, { Component, PropTypes } from 'react';

export default class Message extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const item = this.props.item;

		return(
			<div key={item.key} className="chat__msg-wrap">
				<span className="chat__label">{item.name}:</span><span className="chat__text">{item.message}</span>	
			</div>			
		)
	}
}

Message.propTypes = {
	item: PropTypes.object.isRequired
}