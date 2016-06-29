import React from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

// Firebase
import Rebase  from 're-base';
var base = Rebase.createClass('https://pictionareo.firebaseio.com/');

export default class RoomPicker extends React.Component {
	constructor() {
		super();
	}

	componentDidMount() {
		this.errors = document.querySelector('#errors');
	}

	findRoom(e) {
		e.preventDefault();
		let form = e.target;
		let roomId = form.querySelector('#roomId').value;
		let password = form.querySelector('#password').value;
		let username = form.querySelector('#username').value;

		let formData = {
			room: roomId,
			password: password,
			username: username
		}

		base.fetch('/rooms', {
			context: this,
			then(data) {
				let result = this.runTests(data,formData);
				
				if(result.status) {
					this.passed(formData.room,formData.username,formData.password);
				} else {
					this.failed(result.reason);
				}
			}
		});
	}

	runTests(data,formData) {
		let room = data[formData.room];

		if(!room) { return { status: false, reason: `Room number not found or password incorrect` } }

		let tests = {
			password: {
				func: this.compare,
				args: [room.password, formData.password, `Room number not found or password incorrect`]
			},
			users: {
				func: this.in,
				args: [room.users, formData.username, `Sorry there's already someone called ${formData.username} in that room. Please choose another name.`]
			}
		}

		for(var test in tests) {
			let func = tests[test].func;
			let args = tests[test].args;

			if(!func(args).status) {
				return func(args);
			}
		}

		return { status: true };
	}

	exists(args) {
		if(args[0]) {
			return { status: true };
		} else {
			return { status: false, reason: args[1] };
		}
	}

	compare(args) {
		if(args[0] === args[1]) {
			return { status: true };
		} else {
			return { status: false, reason: args[2] };
		}
	}

	in(args) {
		for(var prop in args[0]) {
			if(args[1] === args[0][prop].name) {
				return { status: false,  reason: args[2] };
			}
		}
		return { status: true };
	}


	passed(roomId,username,password) {
		sessionStorage.setItem(this.props.route.unString,username);
		sessionStorage.setItem(this.props.route.pString,password);

		base.push('/rooms/' + roomId + '/users',{
			data: { name: username },
			then() {
				browserHistory.push('/rooms/' + roomId);
			}
		})		
	}

	failed(reason) {
		this.errors.textContent = reason;
	}

	render() {
		return(
			<article className="wrapper">
				<h2 className="gamma">Join a pictionarium</h2>
				<form className="form" id="joinRoom" onSubmit={this.findRoom.bind(this)} >
					<ul>
						<li className="form__error" id="errors"></li>
						<li>
							<label className="form__control">
								<span className="form__label">Room number</span>
								<span className="form__input-wrap">
									<input autoComplete="off" required id="roomId" type="text" className="form__input"/>
								</span>
							</label>
						</li>
						<li>
							<label className="form__control">
								<span className="form__label">Room password</span>
								<span className="form__input-wrap">
									<input autoComplete="off" required id="password" type="password" className="form__input"/>
								</span>
							</label>
						</li>
						<li>
							<label className="form__control">
								<span className="form__label">Username</span>
								<span className="form__input-wrap">
									<input autoComplete="off" required id="username" type="text" className="form__input"/>
								</span>
							</label>
						</li>
						<li>
							<button className="btn--primary float-right">Submit</button>
						</li>
					</ul>
				</form>
				<h2 className="gamma">Spawn new pictionarium</h2>
				<form className="form" id="createRoom">
					<ul>
						<li>
							<label className="form__control">
								<span className="form__label">Room password</span>
								<span className="form__input-wrap">
									<input autoComplete="off" required id="newPassword" type="password" className="form__input"/>
								</span>
							</label>
						</li>
						<li>
							<button className="btn--primary float-right">Submit</button>
						</li>
					</ul>
				</form>
			</article>			
		)
	}
}