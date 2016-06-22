import React, { Component, PropTypes } from 'react'
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import reactMixin from 'react-mixin';

// Firebase
import Rebase  from 're-base';
var base = Rebase.createClass('https://pictionareo.firebaseio.com/');


// components
import DictionaryItem from './DictionaryItem';
import DifficultyModes from './DifficultyModes';
import Canvas from './Canvas';

export default class App extends Component {
	constructor() {
		super();

		this.state = {
			loaded: false,
			mode: '',
			dictionary: {}
		};
	}

	componentDidMount() {
		this.fetchDictionary();
	}

	fetchDictionary() {
		base.fetch('/dictionary', {
			context: this,
			then: this.syncMode
		});
	}

	syncMode(data) {
		this.setState({
			dictionary: data
		});

		base.syncState('/mode',{
			context: this,
			state: 'mode',
			then: this.gotState
		});
	}

	gotState() {
		this.setState({
			loaded: true
		})
	}

	getWord() {
		this.word = typeof this.word === 'undefined' ? document.querySelector('#word') : this.word;
		let dictionaryBranch = this.state.dictionary[this.state.mode];
		let random = Math.round(Math.random() * (dictionaryBranch.length - 1));

		this.word.textContent = dictionaryBranch[random];
	}

	changeMode(e) {
		this.setState({
			mode: e.target.value
		});
	}

	render() {
		if(this.state.loaded){
			return (
				<article className="wrapper">
					<h1 className="alpha">Pictionary</h1>
					<DifficultyModes scope={this} state={this.state} changeMode={this.changeMode} />
					<span className="canvas__title alpha" id="word"></span>
					<Canvas />
				</article>
			)
		} else {
			return (
				<article className="wrapper">
					<h1 className="alpha">Loading</h1>			
				</article>
			)
		}
	}
}

reactMixin.onClass(App, LinkedStateMixin);