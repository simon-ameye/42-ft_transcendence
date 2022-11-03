import React, { Component } from 'react';

class User extends Component {
	render() {
		return (
			<div>
				<h3>create user page</h3>
				<form>
					<label>Email</label>
					<input 
						type="text"
						required
					/>
					<label>Password</label>
					<input 
						type="text"
						required
					/>
					<label>First Name</label>
					<input 
						type="text"
					/>
					<label>First Name</label>
					<input 
						type="text"
					/>
				</form>
			</div>
		);
	}
}

export default User;