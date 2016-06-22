import React, { Component, PropTypes } from 'react'

export default class DictionaryItems extends Component {
	render() {
		const { data } = this.props.data;
		let output = '';

		console.log(data);

		if(typeof data === 'string') {
			output = data;
		} else {
			output = 'data = object';
		}

		return (
			<li key="key">{output}</li>
		)
	}
}

DictionaryItems.propTypes = {
	data: PropTypes.array.isRequired
}