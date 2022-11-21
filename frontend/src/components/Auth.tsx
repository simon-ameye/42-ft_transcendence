import { useState } from 'react';
import axios from 'axios';
import ResDataInterface from '../interfaces/res-data.interface';
import AuthUserInterface from '../interfaces/auth-user.interface';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export default function Auth () {

	// VARIABLES \\

	const navigate = useNavigate();
	const queryParameters = new URLSearchParams(window.location.search)
	const code = queryParameters.get("code");
	const state = queryParameters.get("state");
	const [cookie, setCookie, removeCookie] = useCookies(['jwtToken', 'pseudo']);

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

	const getIntraMe = (resData: ResDataInterface) => {
		axios.get('http://localhost:3001/auth/intra/getMe', {
			params: {
				token: resData.access_token
			}
		})
			.then(res => displayWelcomeMsg(res.data))
			.catch(err => console.log(err));
	}

	const displayWelcomeMsg = (resData: AuthUserInterface) => {
		console.log(resData);
		setCookie('jwtToken', resData.jwt_token, { path: '/' });
		setCookie('pseudo', resData.pseudo, { path: '/' });
	}

	const	goHome = () => {
		navigate('/');
	}

	return (
		<>
			<div>
				<h1>Hello {cookie.pseudo}!</h1>
			</div>
			<div>
				<button onClick={() => goHome()}>Go to home page</button>
			</div>
		</>
	)
}
