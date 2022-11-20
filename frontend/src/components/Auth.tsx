import { useEffect, useState } from 'react';
import axios from 'axios';
import resDataInterface from '../interfaces/res-data.interface';

export default function Auth () {

	// VARIABLES \\
	const queryParameters = new URLSearchParams(window.location.search)
	const code = queryParameters.get("code");
	const state = queryParameters.get("state");
	const	[resData, setResData] = useState<resDataInterface>();
	let done = false;

	// USE_EFFECT \\

	useEffect(() => {
		if (!done) {
			axios.post('https://api.intra.42.fr/oauth/token', {
				grant_type: "authorization_code",
				client_id: "u-s4t2ud-648c51ea9e1ba58cce46cff68acc6882c3fc4382864770ac7e8f610111a703ec",
				client_secret: "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",
				code: code,
				state: state,
				redirect_uri: "http://localhost:3000/auth"
			})
				.then(res => setResData(res.data))
				.catch(err => console.log(err));
			if (resData !== undefined) {
			axios.post('http://localhost:3001/auth/intra/getme', {
				token: resData.access_token
			})
				.then(res => console.log(res))
				.catch(err => console.log(err));
			}
		}
		done = true;
	}, []);
	return (
		<>
			<h1>WELCOME TO AUTH PAGE</h1>
		</>
	)
}
