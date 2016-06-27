import React, { Component, PropTypes } from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import reactMixin from 'react-mixin';

export default class DifficultyModes extends Component {
	constructor(props) {
		super(props);

		this.dictionary = this.props.state.dictionary;
		this.state = this.props.state;
	}

	renderItem(item,index) {
		if(item === this.state.mode) {
			return <option key={item} value={item}>{item.substring(1)}</option>
		} else {
			return <option key={item} value={item}>{item.substring(1)}</option>
		}
	}

	render() {
		var changeMode = this.props.changeMode;
		var scope = this.props.scope;

		return (
			<form className="form">
				<ul className="form__items">
					<li className="form__item">
						<label className="form__control--select">
							<select className="form__select" defaultValue={this.state.mode} onChange={changeMode.bind(scope)} >
								<option value="0">Select a difficulty mode</option>
								{Object.keys(this.dictionary).map(this.renderItem.bind(this))}
							</select>
						</label>
					</li>
					<li className="form__item right">
						<button type="button" className="btn--primary" onClick={scope.getWord.bind(scope)}>Get word</button>
					</li>
				</ul>
			</form>
		)
	}
}

DifficultyModes.propTypes = {
	state: PropTypes.object.isRequired,
	scope: PropTypes.object.isRequired,
	changeMode: PropTypes.func.isRequired
}