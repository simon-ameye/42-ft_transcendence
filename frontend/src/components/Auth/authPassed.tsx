import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { socket } from '../../App';

export default function AuthPassed () {

	// VARIABLES \\

	const [cookie] = useCookies(['jwtToken', 'displayName', 'login']);
	const navigate = useNavigate();
	const queryParameters = new URLSearchParams(window.location.search)
	const code = queryParameters.get("code");
	const state = queryParameters.get("state");
	const [signupInterface, setSignupInterface] = useState<boolean>(false);
	const [userDisplayName, setUserDisplayName] = useState('');
	const [userProfilePicture, setUserProfilePicture] = useState('');

	// ON INIT \\

	useEffect(() => {
		if (code && state && !cookie.login) {
			axios.post('https://api.intra.42.fr/oauth/token', {
				grant_type: "authorization_code",
				client_id: process.env.REACT_APP_CLIENT_ID,
				client_secret: process.env.REACT_APP_CLIENT_SECRET,
				code: code,
				state: state,
				redirect_uri: "http://localhost:3000/auth"
			})
				.then(res => getIntraMe(res.data))
				.catch(err => console.log(err));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!code && !state && !cookie.login) {
			socket.emit('reload');
			navigate('/auth2fa');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (code === 'signup' && cookie.login === undefined)
			setSignupInterface(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// FUNCTIONS \\

	const getIntraMe = (data: {access_token: string}) => {
		axios.get('http://localhost:3001/auth/intra/getMe', {
			params: {
				token: data.access_token
			}
		})
			.then(res => goToGoogleAuthOrNot(res.data))
			.catch(err => handleIntraErr(err));
	}

	const	goToGoogleAuthOrNot = (dfa: string) => {
		if (dfa === 'yes') {
			navigate('/auth2fa');
		}
		else if (dfa === 'signup')
			setSignupInterface(true);
		else {
			socket.emit('reload');
		}
	}

	const	handleIntraErr = (err: AxiosError) => {
		if (err.response) {
			if (err.response.status === 460) {
				alert('You are already log in from an other device');
			}
			else if (err.response.status === 403) {
				alert('Your credentials are already taken');
			}
		}
		else
			console.log(err);
		navigate('/');
	}

	const	goHome = () => {
		navigate('/');
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		axios.post('http://localhost:3001/auth/signup/info', {
			displayName: userDisplayName,
			imageUrl: userProfilePicture
		})
		  .then(res => handleSubmitReturn())
			.catch(err => handleSignupInfoError(err))
	}

	const handleSignupInfoError = (err: AxiosError) => {
		if (err.response) {
			if (err.response.status === 403)
				alert('DisplayName already taken');
			else if (err.response.status === 401)
				alert('Operation not allowed');
		}
	}

	const handleSubmitReturn = () => {
		setSignupInterface(false);
		window.location.reload();
	}

	// USE_EFFECT \\

	useEffect(() => {
		socket.on("reload", reloadListener);
		return () => {
			socket.off("reload", reloadListener);
		}
	}, []);

	// LISTENER \\

	const reloadListener = () => {
		window.location.reload();
	}

	return !signupInterface ? (
		<>
			<div>
				<h1>Welcome {cookie.displayName} to ft_transcendence!</h1>
			</div>
			<div>
				<button onClick={goHome}>Go to home page</button>
			</div>
		</>
	) : (
	<>
		<h1>Complete your info(optionnal) :</h1>
				<div className="sign-up-container">
					<div className="createUserContent">
						<form onSubmit={handleSubmit}>
							<label>Display name</label>
							<input
								type="text"
								required
								placeholder='Display on pong ranking etc..'
								value={userDisplayName}
								onChange={(e) => setUserDisplayName(e.target.value)}
							/>
							<label>Profile picture</label>
							<input
								id="file"
								type="file"
								value={userProfilePicture}
								onChange={(e) => setUserProfilePicture(e.target.value)}
							/>
							<div className="submit-upload">
								<button type="submit" className='submit-btn'>submit</button>
							</div>
						</form>
					</div>
				</div>
	</>
	)
}
