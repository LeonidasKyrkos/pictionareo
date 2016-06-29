import React from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

// Firebase
import Rebase  from 're-base';
var base = Rebase.createClass('https://pictionareo.firebaseio.com/');

class RoomPicker extends React.Component {
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

		base.fetch('/rooms', {
			context: this,
			then(data) {
				let room = data[roomId];

				if(room && room.password === password) {
					let users = room.users;

					if(typeof users === 'object') {
						let failed = 0;

						Object.keys(users).forEach((val,index)=>{
							console.log(username,val);
							if(username === val) {
								failed++;
							}
						})

						if(failed) {
							this.failTest('user',username);
						} else {
							this.passTest(roomId,username,password);
						}
					}
				} else {
					this.failTest('rpw');
				}
			}
		});
	}

	failTest(type,details) {
		this.testObject = {
			user: `Sorry there's already someone called ${details} in that room. Please choose another name.`,
			rpw: `Room number not found or password incorrect`
		}

		this.errors.textContent = this.testObject[type];
	}

	passTest(roomId,username,password) {
		localStorage.setItem(this.props.route.unString,username);
		localStorage.setItem(this.props.route.pString,password);

		window.location.pathname = '/rooms/' + roomId;
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

export default RoomPicker;