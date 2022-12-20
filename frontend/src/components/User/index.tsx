import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { socket } from '../../App';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import './style.scss';
import GoogleAuthImage from '../../images/googleAuth.png';
import { useCookies } from 'react-cookie';

const User = () => {
	const navigate = useNavigate();
	const [cookie] = useCookies(['displayName']);
	const [userMailUp, setUserMailUp] = useState('');
	const [userPassUp, setUserPassUp] = useState('');
	const [userDisplayNameUp, setUserDisplayNameUp] = useState('');
	const [userMailQrUp, setUserMailQrUp] = useState('');
	const [userDisplayNameQrUp, setUserDisplayNameQrUp] = useState('');
	const [userProfilePicture, setUserProfilePicture] = useState('');
	const [userToken, setUserToken] = useState('');
	const [userGoogleCode, setUserGoogleCode] = useState<string>('');
	const [userMailIn, setUserMailIn] = useState('');
	const [userPassIn, setUserPassIn] = useState('');
	const [userMailQrIn, setUserMailQrIn] = useState('');
	const [userCodeQrIn, setUserCodeQrIn] = useState('');

	// USE_EFFECT \\

	useEffect(() => {
		socket.on("reload", reloadListener);
		return () => {
			socket.off("reload", reloadListener);
		}
	}, []);

	// LISTENER \\

	const reloadListener = () => {
		console.log('heyo');
		window.location.reload();
	}

	// FUNCTIONS \\
	
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		axios.post('http://localhost:3001/auth/signup',{
			email: userMailUp,
			password: userPassUp,
			displayName: userDisplayNameUp,
			imageUrl: userProfilePicture
		})
			.then(res => updateUserSocket())
			.catch(err => handleSignError(err))
	}

  const updateUserSocket = () => {
    axios.put('http://localhost:3001/user/modifySocketId', {
      socketId: socket.id
    })
      .then(res => goToAuthPage())
      .catch(err => console.log(err));
  }

	const goToAuthPage = () => {
		socket.emit('reload');
		navigate('/auth');
	}

  const handleIntra = () => {
    window.location.href = 'http://localhost:3001/auth/42api/login';
  }

	const	logOut = () => {
		axios.delete('http://localhost:3001/auth/logout')
			.then(res => navigate('/'))
			.catch(err => console.log(err));
	}

	const handleGoogleAuthSignup = (e: React.FormEvent) => {
		e.preventDefault();
		axios.post('http://localhost:3001/auth/google2FA/signup',{
			email: userMailQrUp,
			displayName: userDisplayNameQrUp,
		})
			.then(res => goToAuthPage())
			.catch(err => handleSignError(err))
	}

	const handleGoogleAuthSignin = (e: React.FormEvent) => {
		e.preventDefault();
		console.log({email: userMailQrIn});
		console.log({code: userCodeQrIn});
		axios.post('http://localhost:3001/auth/google2FA/signin',{
			email: userMailQrIn,
			code: userCodeQrIn,
		})
			.then(res => goToAuthPage())
			.catch(err => handleSignError(err))
	}

	const handleSignin = (e: React.FormEvent) => {
		e.preventDefault();

		axios.post('http://localhost:3001/auth/signin', {
			email: userMailIn,
			password: userPassIn,
		})
			.then(res => updateUserSocket())
			.catch(err => handleSignError(err))
	}

	const handleSignError = (err: AxiosError) => {
		if (err.response) {
			if (err.response.status == 403) {
				alert('Credentials already taken');
			}
			else if (err.response.status == 461) {
				alert('Credentials invalided');
			}
			else if (err.response.status == 462) {
				alert('Use an other way to log in');
			}
			else if (err.response.status == 460) {
				alert('You are already log in');
			}
		}
	}

	return (
		<>
			<Navbar />
			<h1>SIGN UP</h1>
			<div className="createUser">
				<div className="createUserContent">
					<form onSubmit={handleSubmit}>
						<label>Email</label>
						<input 
							type="email"
							pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
							placeholder='ex: "test@test.fr"'
							required
							value={userMailUp}
							onChange={(e) => setUserMailUp(e.target.value)}
						/>
						<label>Display name</label>
						<input 
							type="text"
							required
							placeholder='Display on pong ranking etc..'
							value={userDisplayNameUp}
							onChange={(e) => setUserDisplayNameUp(e.target.value)}
						/>
						<label>Password</label>
						<input
							type="password"
							placeholder='"123" is not a strong password ¯\_(ツ)_/¯'
							required
							value={userPassUp}
							onChange={(e) => setUserPassUp(e.target.value)}
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
				<button onClick={handleIntra} className='login-btn'>
					<p>Login with</p>
					<img src='https://profile.intra.42.fr/assets/42_logo_black-684989d43d629b3c0ff6fd7e1157ee04db9bb7a73fba8ec4e01543d650a1c607.png' alt="42-logo"></img>
				</button>
			</div>
				<div className="createUser">
					<form>
						<label>Email</label>
						<input 
							type="email"
							pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
							placeholder='ex: "test@test.fr"'
							required
							value={userMailQrUp}
							onChange={(e) => setUserMailQrUp(e.target.value)}
						/>
						<label>Display name</label>
						<input 
							type="text"
							required
							placeholder='Display on pong ranking etc..'
							value={userDisplayNameQrUp}
							onChange={(e) => setUserDisplayNameQrUp(e.target.value)}
						/>
						<button onClick={handleGoogleAuthSignup} className='login-btn'>
							<p>Login with</p>
							<img src={GoogleAuthImage} alt="google authentificator" style={{ width: '100px' }}></img>
						</button>
					</form>
				</div>
			<br></br>
			<br></br>
			<br></br>
			<br></br>
			<h1>SIGN IN</h1>
			<div className="createUser">
				<div className="createUserContent">
					<form onSubmit={handleSignin}>
						<label>Email</label>
						<input 
							type="email"
							pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
							placeholder='ex: "test@test.fr"'
							required
							value={userMailIn}
							onChange={(e) => setUserMailIn(e.target.value)}
						/>
						<label>Password</label>
						<input
							type="password"
							placeholder='"123" is not a strong password ¯\_(ツ)_/¯'
							required
							value={userPassIn}
							onChange={(e) => setUserPassIn(e.target.value)}
						/>
						<button type="submit" className='submit-btn'>submit</button>
					</form>
				</div>
				<div className="or">OR</div>
				<button onClick={handleIntra} className='login-btn'>
					<p>Login with</p>
					<img src='https://profile.intra.42.fr/assets/42_logo_black-684989d43d629b3c0ff6fd7e1157ee04db9bb7a73fba8ec4e01543d650a1c607.png' alt="42-logo"></img>
				</button>
			</div>
				<div className="createUser">
					<form>
						<label>Email</label>
						<input 
							type="email"
							pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
							placeholder='ex: "test@test.fr"'
							required
							value={userMailQrIn}
							onChange={(e) => setUserMailQrIn(e.target.value)}
						/>
						<label>google code</label>
						<input 
							type="text"
							required
							placeholder='google authentificator code'
							value={userCodeQrIn}
							onChange={(e) => setUserCodeQrIn(e.target.value)}
						/>
						<button onClick={handleGoogleAuthSignin} className='login-btn'>
							<p>Login with</p>
							<img src={GoogleAuthImage} alt="google authentificator" style={{ width: '100px' }}></img>
						</button>
					</form>
				</div>
		</>
	);
};

export default User;
