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
		this.roomId = 1;
		this.userId = 'leo';

		this.defaultDrawState = [];

		this.state = {
			loaded: false,
			dictionary: {},
			puzzle: '',
			chatLog: [],
			drawState: this.defaultDrawState,
			player: true,
			userId: this.userId,
			roomId: this.roomId
		};
	}

	componentDidMount() {
		base.fetch('/dictionary', {
			context: this,
			then(data) {
				this.setState({
					dictionary: data
				});
			}
		});

		base.fetch('/rooms/' + this.state.roomId + '/puzzle/' + this.state.userId, {
			context: this,
			then(data) {
				this.wordHandler(data);
			}
		})

		base.syncState('/rooms/' + this.state.roomId + '/chatLog',{
			context: this,
			state: 'chatLog',
			asArray: true,
			queries: {
				orderByChild: 'timestamp'
			}
		});

		base.syncState('/rooms/' + this.state.roomId + '/drawState',{
			context: this,
			state: 'drawState',
			asArray: true
		});
	}

	wordHandler(word) {
		if(word) {
			this.setWord(word);
		} else {
			let dictionary = this.state.dictionary;
			let random = Math.round(Math.random() * (Object.keys(dictionary).length - 1));
			let word = Object.keys(dictionary)[random];

			let data = {};
			data[this.state.userId] = word;
			let scope = this;

			base.post('/rooms/' + this.state.roomId + '/puzzle', {
				data,
				then(){
					scope.setWord(data[scope.state.userId]);
				}
			});
		}
	}

	setWord(word) {
		this.setState({
			puzzle: word
		})
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

			base.push('/rooms/' + this.state.roomId + '/chatLog', {
				data,
				then(){
					input.value = "";
					chatHistory.scrollTop = chatHistory.scrollHeight;
				}
			});
		}
	}

	render() {
		if(Object.keys(this.state.dictionary).length && typeof this.state.puzzle !== 'object'){
			return (
				<article className="wrapper">
					<h1 className="alpha">Pictionary</h1>
					<div className="game__wrap">
						<span className="game__title" id="word">{this.state.puzzle || 'fetching puzzle...'}</span>
						<Canvas base={base} scope={this} player={this.state.player} drawState={this.state.drawState} />
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