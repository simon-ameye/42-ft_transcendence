import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { socket } from '../App';

export default function Auth () {

	// VARIABLES \\

	const [cookie, setCookie] = useCookies(['jwtToken', 'displayName']);
	const navigate = useNavigate();
	const queryParameters = new URLSearchParams(window.location.search)
	const code = queryParameters.get("code");
	const state = queryParameters.get("state");

	// FUNCTIONS \\

	axios.post('https://api.intra.42.fr/oauth/token', {
		grant_type: "authorization_code",
		client_id: "u-s4t2ud-648c51ea9e1ba58cce46cff68acc6882c3fc4382864770ac7e8f610111a703ec",
		client_secret: "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",
		code: code,
		state: state,
		redirect_uri: "http://localhost:3000/auth"
	})
		.then(res => getIntraMe(res.data))
		.catch(err => console.log(err));

	const getIntraMe = (data: {access_token: string}) => {
		axios.get('http://localhost:3001/auth/intra/getMe', {
			params: {
				token: data.access_token
			}
		})
			.then(res => updateUserSocket())
			.catch(err => console.log(err));
	}

	const updateUserSocket = () => {
		axios.put('http://localhost:3001/user/modifySocketId', {
			socketId: socket.id
		})
			.then(res => socket.emit('reload'))
			.catch(err => console.log(err));
	}

	const	goHome = () => {
		navigate('/');
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
		console.log('heyo');
		window.location.reload();
	}

	return (
		<>
			<div>
				<h1>Hello {cookie.displayName}!</h1>
			</div>
			<div>
				<button onClick={goHome}>Go to home page</button>
			</div>
		</>
	)
}
