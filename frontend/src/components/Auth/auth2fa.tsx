import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { socket } from '../../App';
import { useNavigate } from 'react-router-dom';
import '../User/style.scss';
import GoogleAuthImage from '../../assets/googleAuth.png';
import { useCookies } from 'react-cookie';

const Auth2FA = () => {

	// VARIABLES \\

	const [cookie] = useCookies(['displayName']);
	const [googleCode, setGoogleCode] = useState<string>('');
	const navigate = useNavigate();
	
	// FUNCTIONS \\

	const handleGoogleAuth = (e: React.FormEvent) => {
		e.preventDefault();
		axios.post('http://localhost:3001/auth/google2FA/verify',{
			code: googleCode,
			displayName: cookie.displayName
		})
			.then(res => goToAuthPage())
			.catch(err => handleSignError(err))
	}

	const goToAuthPage = () => {
		socket.emit('reload');
		navigate('/auth');
	}

	const handleSignError = (err: AxiosError) => {
		if (err.response) {
			if (err.response.status === 403) {
				alert('Credentials already taken');
			}
			else if (err.response.status === 461) {
				alert('Credentials invalided');
			}
			else if (err.response.status === 462) {
				alert('Use an other way to log in');
			}
			else if (err.response.status === 460) {
				alert('You are already log in');
			}
		}
	}

	return (
		<div className="createUserContent">
			<form>
						<label>Google Code</label>
						<input
							type="text"
							required
							placeholder='Enter your google code'
							value={googleCode}
							onChange={(e) => setGoogleCode(e.target.value)}
						/>
						<button onClick={handleGoogleAuth} className='login-btn'>
							<p>Login with</p>
							<img src={GoogleAuthImage} alt="google authentificator" className='g-auth-logo'></img>
						</button>
					</form>
		</div>
	)
}

export default Auth2FA;
