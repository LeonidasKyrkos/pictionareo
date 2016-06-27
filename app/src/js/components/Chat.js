import React, { Component, PropTypes } from 'react';

import Message from './Message';

export default class Chat extends Component {
	render() {
		const scope = this.props.scope;
		const chatLog = this.props.chatLog;
		const chatHistory = document.querySelector('#chat-history');

		const chats = chatLog.map((item,index)=>{
			return (
				<Message item={item} key={item.key} />
			)
		});

		if(chatHistory) { 
			setTimeout(()=>{ chatHistory.scrollTop = chatHistory.scrollHeight},32); 
		};
		

		return (
			<div className="chat">
				<div id="chat-history" className="chat__history">
					{chats}
				</div>
				<form className="form--chat" onSubmit={scope.pushChats.bind(scope)}>
					<input autoComplete="off" id="chat-input" type="text" className="form__input"/>
					<button className="btn--submit flex-right">»</button>
				</form>
			</div>
		)
	}
}


Chat.propTypes = {
	chatLog: PropTypes.array.isRequired,
	scope: PropTypes.object.isRequired
}