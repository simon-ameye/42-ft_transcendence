import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../../App';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import GoogleAuthImage from '../../assets/googleAuth.png';
import { useCookies } from 'react-cookie';
import Default from '../../layouts/Default';

const User = () => {
	const navigate = useNavigate();
	const [cookie] = useCookies(['displayName', 'qrcode']);
	const [userMail, setUserMail] = useState('');
	const [userPass, setUserPass] = useState('');
	const [userDisplayName, setUserDisplayName] = useState('');
	const [userProfilePicture, setUserProfilePicture] = useState('');
	const [qrcode, setQrcode] = useState<string>('');
	const [displayqrcode, setDisplayqrcode] = useState<boolean>(false);
	const [displayqrcodeMessage, setDisplayqrcodeMessage] = useState<string>("Display QR Code");
	const [userToken, setUserToken] = useState('');
	const [userGoogleCode, setUserGoogleCode] = useState<string>('');
	const [userMailIn, setUserMailIn] = useState('');
	const [userMailIn2, setUserMailIn2] = useState('');
	const [userPassIn, setUserPassIn] = useState('');

	// USE_EFFECT \\

	useEffect(() => {
		console.log({ qrcode: cookie.qrcode });
		console.log({ displayname: cookie.displayName });
		if (cookie.qrcode !== undefined && cookie.qrcode === 'yes') {
			axios.get('http://localhost:3001/user/qrcode')
				.then(res => setQrcode(res.data))
				.catch(err => console.log(err))
		}
	}, []);

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

		axios.post('http://localhost:3001/auth/signup', {
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

	const getSocketId = () => {
		axios.get('http://localhost:3001/user/socketId', {
		})
			.then(res => console.log(res))
			.catch(err => console.log(err));
	}

	const logOut = () => {
		axios.delete('http://localhost:3001/auth/logout')
			.then(res => navigate('/'))
			.catch(err => console.log(err));
	}

	const handleGoogleAuthSignup = (e: React.FormEvent) => {
		e.preventDefault();
		axios.post('http://localhost:3001/auth/google2FA/signup', {
			email: userMail,
			displayName: userDisplayName,
		})
			.then(res => setQrcode(res.data))
			.catch(err => console.log(err))
	}

	const displayQrcode = () => {
		setDisplayqrcode(!displayqrcode);
		if (!displayqrcode)
			setDisplayqrcodeMessage("Hide QR Code");
		else
			setDisplayqrcodeMessage("Display QR Code");
	}

	const handleGoogleAuthSignin = (e: React.FormEvent) => {
		e.preventDefault();
		axios.post('http://localhost:3001/auth/google2FA/signin', {
			email: userMail,
			code: userGoogleCode,
		})
			.then(res => setQrcode(res.data))
			.catch(err => console.log(err))
	}

	const handleSignin = (e: React.FormEvent) => {
		e.preventDefault();

		console.log('signin');
		axios.post('http://localhost:3001/auth/signin', {
			email: userMailIn,
			password: userPassIn,
		})
			.then(res => updateUserSocket())
			.catch(err => console.log(err))
	}

	return (
		<Default>
			<div className="authentification-container">
				<h1>SIGN UP :</h1>
				<div className="sign-up-container">
					<div className="createUserContent">
						<form onSubmit={handleSubmit}>
							<label>Email</label>
							<input
								type="email"
								pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
								placeholder='ex: "test@test.fr"'
								required
								value={userMail}
								onChange={(e) => setUserMail(e.target.value)}
							/>
							<label>Display name</label>
							<input
								type="text"
								required
								placeholder='Display on pong ranking etc..'
								value={userDisplayName}
								onChange={(e) => setUserDisplayName(e.target.value)}
							/>
							<label>Password</label>
							<input
								type="password"
								placeholder='"123" is not a strong password'
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
					{/*<form>
						<label>Email</label>
						<input
							type="email"
							pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
							placeholder='ex: "test@test.fr"'
							required
							value={userMail}
							onChange={(e) => setUserMail(e.target.value)}
						/>
						<label>Display name</label>
						<input
							type="text"
							required
							placeholder='Display on pong ranking etc..'
							value={userDisplayName}
							onChange={(e) => setUserDisplayName(e.target.value)}
						/>
						<button onClick={handleGoogleAuthSignup} className='login-btn'>
							<p>Login with</p>
							<img src={GoogleAuthImage} alt="google authentificator" className='g-auth-logo'></img>
						</button>
					</form>
					{qrcode &&
						<button onClick={displayQrcode} className='submit-btn'>{displayqrcodeMessage}</button>}
					{displayqrcode && <img src={qrcode} alt="qrcode" style={{ width: '400px' }}></img>
					}*/}
				</div>
				<h1>SIGN IN :</h1>
				<div className="sign-in-container">
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
								placeholder='Password'
								required
								value={userPassIn}
								onChange={(e) => setUserPassIn(e.target.value)}
							/>
							<button type="submit" className='submit-btn'>submit</button>
						</form>
					</div>
					{/*<div className="createUserContent">
						<form>
							<label>Email</label>
							<input
								type="email"
								pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
								placeholder='ex: "test@test.fr"'
								required
								value={userMailIn2}
								onChange={(e) => setUserMailIn2(e.target.value)}
							/>
							<label>Google code</label>
							<input
								type="text"
								required
								placeholder='google authentificator code'
								value={userDisplayName}
								onChange={(e) => setUserDisplayName(e.target.value)}
							/>
							<button onClick={handleGoogleAuthSignin} className='login-btn'>
								<p>Login with</p>
								<img src={GoogleAuthImage} alt="google authentificator" className='g-auth-logo'></img>
							</button>
						</form>
					</div>*/}
					<div className="createUserContent">
						<button onClick={handleIntra} className='login-btn'>
							<p>Sign-in with</p>
							<img src='https://profile.intra.42.fr/assets/42_logo_black-684989d43d629b3c0ff6fd7e1157ee04db9bb7a73fba8ec4e01543d650a1c607.png' alt="42-logo" className='school-logo'></img>
						</button>
					</div>
				</div>
			</div>
		</Default>
	);
};


export default User;
