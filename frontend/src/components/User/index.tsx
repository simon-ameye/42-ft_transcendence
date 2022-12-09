import React, { useState } from 'react';
import axios from 'axios';
import { socket } from '../../App';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import './style.scss'

const User = () => {
	const navigate = useNavigate();
	const [userMail, setUserMail] = useState('');
	const [userPass, setUserPass] = useState('');
	const [userDisplayName, setUserDisplayName] = useState('');
	const [userProfilePicture, setUserProfilePicture] = useState('');
	
	const [userToken, setUserToken] = useState('');
	
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		axios.post('http://localhost:3001/auth/signup',{
			email: userMail,
			password: userPass,
			displayName: userDisplayName,
			imageUrl: userProfilePicture
		})
			.then(res => updateUserSocket())
			.catch(err => console.log(err))
	}

	const updateUserSocket = () => {
		axios.put('http://localhost:3001/user/modifySocketId', {
			socketId: socket.id
		})
			.then(res => navigate('/auth'))
			.catch(err => console.log(err));
	}

	const handleLogin = () => {
		console.log('handle login');
		window.location.href = 'http://localhost:3001/auth/42api/login';
	}

	const getSocketId = () => {
		axios.get('http://localhost:3001/user/socketId', {
		})
			.then(res => console.log(res))
			.catch(err => console.log(err));
	}

	const	logOut = () => {
		axios.delete('http://localhost:3001/auth/logout')
			.then(res => navigate('/'))
			.catch(err => console.log(err));
	}

	return (
		<>
			<Navbar />
			<div className="createUser">
				<div className="createUserContent">
					<form onSubmit={handleSubmit}>
						<label>Email</label>
						<input 
							type="email"
							pattern="[\w]{1,}[\w.+-]{0,}@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$"
							placeholder='ex: "test@test.fr"'
							required
							value={userMail}
							onChange={(e) => setUserMail(e.target.value)}
						/>
						<label>Username</label>
						<input 
							type="text"
							placeholder='Display on pong ranking etc..'
							value={userDisplayName}
							onChange={(e) => setUserDisplayName(e.target.value)}
						/>
						<label>Password</label>
						<input
							type="password"
							placeholder='"123" is not a strong password ¯\_(ツ)_/¯'
							required
							value={userPass}
							onChange={(e) => setUserPass(e.target.value)}
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
				<div className="or">OR</div>
				<button onClick={handleLogin} className='login-btn'>
					<p>Login with</p>
					<img src='https://profile.intra.42.fr/assets/42_logo_black-684989d43d629b3c0ff6fd7e1157ee04db9bb7a73fba8ec4e01543d650a1c607.png' alt="42-logo"></img>
				</button>
				<div>
					<button onClick={getSocketId}>Get SocketID in Console</button>
				</div>
			</div>
			<div>
				<button onClick={logOut}>LOGOUT</button>
			</div>
		</>
	);
};

export default User;
