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
import Chat from './Chat';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.roomId = this.props.route.roomId;

		this.defaultDrawState = [];

		this.state = {
			loaded: false,
			dictionary: {},
			puzzle: '',
			chatLog: [],
			drawState: this.defaultDrawState,
			player: true	
		};
	}

	componentDidMount() {
		base.fetch('/dictionary', {
			context: this,
			then: this.gotState
		});

		base.syncState('/rooms/' + this.roomId + '/puzzle', {
			context: this,
			state: 'puzzle'
		});

		base.syncState('/rooms/' + this.roomId + '/chatLog',{
			context: this,
			state: 'chatLog',
			asArray: true,
			queries: {
				orderByChild: 'timestamp'
			}
		});

		base.syncState('/rooms/' + this.roomId + '/drawState',{
			context: this,
			state: 'drawState',
			asArray: true
		});
	}

	gotState(data) {
		this.setState({
			dictionary: data,
			loaded: true
		})
	}

	getWord() {
		let dictionary = this.state.dictionary;
		let random = Math.round(Math.random() * (Object.keys(dictionary).length - 1));
		let word = Object.keys(dictionary)[random];

		this.setState({
			puzzle: word
		});
	}

	pushDrawState(obj) {
		this.setState({
			drawState: obj
		});
	}

	pushChats(e) {
		e.preventDefault();
		let form = e.target;
		let input = form.querySelector('#chat-input');
		let msg = input.value;
		let chatHistory = document.querySelector('#chat-history');

		if(msg.length) {
			let name = 'maggie';
			
			let timestamp = (new Date()).getTime();
			let data = {};
			data.name = name;
			data.message = msg;
			data.timestamp = timestamp;

			base.push('/rooms/room1/chatLog', {
				data,
				then(){
					input.value = "";
					chatHistory.scrollTop = chatHistory.scrollHeight;
				}
			});
		}
	}

	render() {
		if(this.state.loaded === true){
			return (
				<article className="wrapper">
					<h1 className="alpha">Pictionary</h1>					
					<div className="game__wrap">
						<Canvas base={base} scope={this} player={this.state.player} drawState={this.state.drawState} puzzle={this.state.puzzle} />
						<Chat scope={this} chatLog={this.state.chatLog} />
					</div>					
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