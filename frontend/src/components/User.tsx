import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const User = () => {
	const [userMail, setUserMail] = useState('');
	const [userPass, setUserPass] = useState('');
	const [userDisplayName, setUserDisplayName] = useState('');
	const [userProfilePicture, setUserProfilePicture] = useState('');

	const handleSubmit = (e: any) => {
		e.preventDefault();
		axios.post('http://localhost:3001/auth/signup',{
			email: userMail,
			password: userPass,
			displayName: userDisplayName,
			imageUrl: userProfilePicture
		}).then(res => console.log(res)).catch(err => console.log(err))
	}

	return (
		<div className="createUser">
			<Navbar />
			<div className="createUserContent">
				<h3>Create user page</h3>
				<form onSubmit={handleSubmit} method='POST'>
					<label title='Email is mandatory'>Email</label>
					<input 
						type="email"
						placeholder='Email'
						required
						value={userMail}
						onChange={(e) => setUserMail(e.target.value)}
					/>
					<label title='Password is mandatory'>Password</label>
					<input
						type="password"
						placeholder='Password'
						required
						value={userPass}
						onChange={(e) => setUserPass(e.target.value)}
					/>
					<label>Username</label>
					<input 
						type="text"
						placeholder='Username'
						value={userDisplayName}
						onChange={(e) => setUserDisplayName(e.target.value)}
					/>
					<input
						id="file"
						type="file"
						value={userProfilePicture}
						onChange={(e) => setUserProfilePicture(e.target.value)}
						/>
					<div className="submit-upload">
						<label className="upload" htmlFor="file">Upload profile picture</label>
						<button type="submit" className='submit-btn'>submit</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default User;