import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../../App';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import './style.scss';
import GoogleAuthImage from '../../images/googleAuth.png';
import { useCookies } from 'react-cookie';

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

	useEffect(() => {
		console.log({qrcode: cookie.qrcode});
		console.log({displayname: cookie.displayName});
		if (cookie.qrcode !== undefined && cookie.qrcode === 'yes') {
			axios.get('http://localhost:3001/user/qrcode')
				.then(res => setQrcode(res.data))
				.catch(err => console.log(err))
		}
	}, []);
	
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

	const handleGoogleAuth = (e: React.FormEvent) => {
		e.preventDefault();
		axios.post('http://localhost:3001/auth/google2FA/signup',{
			email: userMail,
			displayName: userDisplayName,
		})
			.then(res => setQrcode(res.data))
			.catch(err => console.log(err))
	}

	const	displayQrcode = () => {
		setDisplayqrcode(!displayqrcode);
		if (!displayqrcode)
			setDisplayqrcodeMessage("Hide QR Code");
		else
			setDisplayqrcodeMessage("Display QR Code");
	}

	const updateUserSocketGoogle = (qrcodeURL: string) => {
		window.location.href = 'http://localhost:3000';
//		axios.put('http://localhost:3001/user/modifySocketId', {
//			socketId: socket.id
//		})
//			.then(res => console.log(res))
//			.catch(err => console.log(err));
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
			</div>
				<form>
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
					<button onClick={handleGoogleAuth} className='login-btn'>
						<p>Login with</p>
						<img src={GoogleAuthImage} alt="google authentificator" style={{ width: '100px' }}></img>
				</button>
				</form>
				{qrcode &&
					<button onClick={displayQrcode} className='submit-btn'>{displayqrcodeMessage}</button>}
						{displayqrcode && <img src={qrcode} alt="qrcode" style={{ width: '400px' }}></img>
				}
		</>
	);
};

export default User;
