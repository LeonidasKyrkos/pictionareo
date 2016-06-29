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
		this.roomId = this.props.routeParams.roomId;
		this.userId = this.props.route.username;

		this.defaultDrawState = [];

		var playerStatus = this.userId === 'leo' ? true : false;

		this.state = {
			loaded: false,
			dictionary: {},
			puzzle: '',
			chatLog: [],
			drawState: this.defaultDrawState,
			player: playerStatus,
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


		if(this.state.player) {
			base.fetch('/rooms/' + this.state.roomId + '/puzzle', {
				context: this,
				then(data) {
					this.wordHandler(data);
				}
			})
		} else {
			base.syncState('/rooms/' + this.state.roomId + '/puzzle/word',{
				context: this,
				state: 'puzzle'
			});
		}
		
	}

	wordHandler(data) {
		if(data && data.user === this.state.userId) {
			this.setWord(data.word);
		} else {
			let dictionary = this.state.dictionary;
			let random = Math.round(Math.random() * (Object.keys(dictionary).length - 1));
			let word = Object.keys(dictionary)[random];

			let data = {};
			data.word = word;
			data.user = this.state.userId;
			let scope = this;

			base.post('/rooms/' + this.state.roomId + '/puzzle', {
				data,
				then(){
					scope.setWord(word);
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
			let timestamp = (new Date()).getTime();
			let data = {};
			data.name = this.state.userId;
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

	underscorePuzzle() {
		let length = this.state.puzzle.length || 0;
		let string = '';

		if(length) {
			for(var i = 0; i < length; i++) {
				string += '_ ';
			}

			return string;
		}
	}

	render() {
		if(this.state.player) {
			var puzzle = <span className="game__title" id="word">{this.state.puzzle || 'fetching puzzle...'}</span>;
		} else {
			var puzzle = <span className="game__title" id="word">{this.underscorePuzzle() || 'fetching puzzle...'}</span>;
		}


		if(Object.keys(this.state.dictionary).length && typeof this.state.puzzle !== 'object'){
			return (
				<article className="wrapper">
					<h1 className="alpha">Pictionary</h1>
					<div className="game__wrap">
						{puzzle}
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