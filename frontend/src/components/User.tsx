import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const User = () => {
	const [userMail, setUserMail] = useState('');
	const [userPass, setUserPass] = useState('');
	const [userFirstName, setUserFirstName] = useState('');
	const [userLastName, setUserLastName] = useState('');
	const [userProfilePicture, setUserProfilePicture] = useState('');

	const handleSubmit = (e: any) => {
		e.preventDefault();
		const data = { userMail, userPass, userFirstName, userLastName, userProfilePicture };

		axios.post('http://localhost:3000/auth/signup',{
			data
		}).then(res => console.log(res)).catch(err => console.log(err))
	}

	return (
		<div className="createUser">
			<Navbar />
			<div className="createUserContent">
				<h3>Create user page</h3>
				<form onSubmit={handleSubmit}>
					<label>Email</label>
					<input 
						type="email"
						required
						value={userMail}
						onChange={(e) => setUserMail(e.target.value)}
					/>
					<label>Password</label>
					<input
						type="password"
						required
						value={userPass}
						onChange={(e) => setUserPass(e.target.value)}
					/>
					<label>First Name</label>
					<input 
						type="text"
						value={userFirstName}
						onChange={(e) => setUserFirstName(e.target.value)}
					/>
					<label>Last Name</label>
					<input 
						type="text"
						value={userLastName}
						onChange={(e) => setUserLastName(e.target.value)}
					/>
				</form>
				<form>
					<input
						id="file"
						type="file"
						value={userProfilePicture}
						onChange={(e) => setUserProfilePicture(e.target.value)}
						/>
					<label className="upload" htmlFor="file">Upload profile picture</label>
					<button onClick={handleSubmit}>submit</button>
				</form>
			</div>
		</div>
	);
};

export default User;