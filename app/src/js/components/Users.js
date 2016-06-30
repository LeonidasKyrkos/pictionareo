import React, { Component, PropTypes } from 'react'

export default class Users extends Component {
	constructor(props) {
		super(props);
	}
	renderUsers() {	
		if(this.usersObj.length) {

		}
	}
	render() {
		this.usersObj = this.props.users;
		let userClass = 'users__user';
		let users = this.usersObj.map((user,index)=>{
			if(user.player) { 
				var status = ' active';
			} else {
				var status = '';
			}

			return (
				<li key={user.name}>
					<span className={userClass + status}>{user.name}</span>
				</li>
			)
		})

		return (
			<ul className="users__list">
				{users}
			</ul>
		)
	}
}

Users.propTypes = {
	users: PropTypes.array.isRequired
}