import axios, { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { socket } from '../../App';

export default function AuthPassed() {

	// VARIABLES \\

	const [cookie] = useCookies(['jwtToken', 'displayName', 'login']);
	const navigate = useNavigate();
	const queryParameters = new URLSearchParams(window.location.search)
	const code = queryParameters.get("code");
	const state = queryParameters.get("state");

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

	// FUNCTIONS \\

	const getIntraMe = (data: { access_token: string }) => {
		axios.get('http://localhost:3001/auth/intra/getMe', {
			params: {
				token: data.access_token
			}
		})
			.then(res => goToGoogleAuthOrNot(res.data))
			.catch(err => handleIntraErr(err));
	}

	const goToGoogleAuthOrNot = (dfa: string) => {
		if (dfa === 'yes') {
			navigate('/auth2fa');
		}
		else {
			socket.emit('reload');
		}
	}

	const handleIntraErr = (err: AxiosError) => {
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

	// USE_EFFECT \\

	useEffect(() => {
		socket.on("reload", reloadListener);
		return () => {
			socket.off("reload", reloadListener);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// LISTENER \\

	const reloadListener = () => {
		window.location.reload();
		navigate('/');
	}

	return (
		<></>
	)
}
