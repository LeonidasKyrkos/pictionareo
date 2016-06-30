import React, { Component, PropTypes } from 'react'

// components
import DictionaryItem from './DictionaryItem';
import DifficultyModes from './DifficultyModes';
import Canvas from './Canvas';
import Chat from './Chat';
import Users from './Users';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.roomId = this.props.routeParams.roomId;
		this.userId = this.props.route.username;
		this.userIndex = this.props.route.userIndex;
		this.base = this.props.route.base;

		this.defaultDrawState = [];

		let playerStatus = false;

		this.state = {
			dictionary: {},
			puzzle: '',
			chatLog: [],
			drawState: this.defaultDrawState,
			drawImg: {},
			player: playerStatus,
			activePlayer: '',
			userId: this.userId,
			roomId: this.roomId,
			userIndex: this.userIndex,
			users: []
		};
	}

	componentDidMount() {
		this.base.fetch('/dictionary', {
			context: this,
			then(data) {
				this.setState({
					dictionary: data
				});
			}
		});

		this.base.syncState('/rooms/' + this.state.roomId + '/chatLog',{
			context: this,
			state: 'chatLog',
			asArray: true,
			queries: {
				orderByChild: 'timestamp'
			}
		});

		this.base.syncState('/rooms/' + this.state.roomId + '/drawState',{
			context: this,
			state: 'drawState',
			asArray: true
		});

		this.base.syncState('/rooms/' + this.state.roomId + '/users',{
			context: this,
			state: 'users',
			asArray: true
		});

		this.base.listenTo('/rooms/' + this.state.roomId + '/puzzle', {
			context: this,
			then(puzzle){
				console.log(puzzle);
			}
		})
	}

	getWord() {
		let dictionary = this.state.dictionary;
		let random = Math.round(Math.random() * (Object.keys(dictionary).length - 1));
		let word = Object.keys(dictionary)[random];

		return word;
	}

	setWord(word) {
		this.setState({
			puzzle: word
		})		
	}

	pushDrawState(obj) {
		// I used to set state here and let the re-base syncstate update the firebase db. This no longer works for some reason...	
		this.base.post('/rooms/' + this.state.roomId + '/drawState', {
			data: obj
		});
	}

	pushDrawImage(img) {
		this.base.post('/rooms/' + this.state.roomId + '/drawImg', {
			data: { image: img }
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

			if(data.message === this.state.puzzle) {
				console.log(this.state.users[this.state.userIndex]);
				input.value = "";
				window.alert(`correct! well done ${this.state.userId}`);
			} else {
				this.base.push('/rooms/' + this.state.roomId + '/chatLog', {
					data,
					then(){
						input.value = "";
						chatHistory.scrollTop = chatHistory.scrollHeight;
					}
				});
			}

			
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
					<Users users={this.state.users} />
					<div className="game__wrap">
						{puzzle}
						<Canvas base={this.base} scope={this} player={this.state.player} drawState={this.state.drawState} users={this.state.users}  />
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