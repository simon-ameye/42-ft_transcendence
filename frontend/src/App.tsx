import { useEffect, useState } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom'
import Home from './components/Home';
import User from './components/User';
import Game from './components/AbrunGame/Game';
import io from 'socket.io-client';
import Auth from './components/Auth';
import axios, { AxiosError } from 'axios';
import GameLive from './components/GameSetup';
import ChatBox from './components/Chat/ChatBox'
import Profile from './components/Profile/Profile'
import NotFound from './components/NotFound';
import { useCookies } from 'react-cookie';
import InvitPopup from './components/AbrunGame/invit-popup.component';
import UnavailableInterface from './interfaces/unavailable.interface';
import Friends from './components/Friends';

axios.defaults.withCredentials = true;

export let socket = io('http://localhost:4343', { withCredentials: true });

function App() {

	// ON INIT \\

	socket.emit('hello');

	// VARIABLES \\
	const [cookie] = useCookies(['displayName', 'jwtToken']);
	const navigate = useNavigate();

	// USE EFFECT \\

	useEffect(() => {
		socket.on("heyo", heyoListener);
		return () => {
			socket.off("heyo", heyoListener);
		}
	});

	useEffect(() => {
		socket.on("reload", reloadListener);
		return () => {
			socket.off("reload", reloadListener);
		}
	});

	useEffect(() => {
		socket.on("start game", startGameListener);
		return () => {
			socket.off("start game", startGameListener);
		}
	});

	useEffect(() => {
		socket.on("cannot invit", cannotInvitListener);
		return () => {
			socket.off("cannot invit", cannotInvitListener);
		}
	});

	// LISTENER \\

	const heyoListener = () => {
		if (cookie.displayName) {
			axios.put('http://localhost:3001/user/modifySocketId', {
				socketId: socket.id
			})
				.then(res => socket.emit('is playing'))
				.catch(err => handleTokenCorrupted(err));
		}
	}

	const reloadListener = () => {
		window.location.reload();
	}

	const startGameListener = () => {
		navigate('/game/live');
	}

	const cannotInvitListener = (unavailable: UnavailableInterface) => {
		if (unavailable.why == 1) {
			alert(unavailable.name + ' is not log in');
		}
		else if (unavailable.why == 2) {
			alert(unavailable.name + ' is already in a game');
		}
		else if (unavailable.why == 3) {
			alert(unavailable.name + ' is in the matching queue');
		}
	}

	// FUNCTIONS \\

	const handleTokenCorrupted = (err: AxiosError) => {
		if (err.response && err.response.status == 403)
			alert('Cookies corrupted');
	}

  return cookie.displayName ? (
		<>
  	  <Routes>
  	    <Route path="/auth" element={<Auth />} />
  	    <Route path="/" element={<Home />} />
  	    <Route path="/ChatBox" element={<ChatBox />} />
				<Route path="/game" element={<Game />} />
				<Route path="/game/live" element={<GameLive />} />
				<Route path="/Profile" element={<Profile />} />
				<Route path="/friends" element={<Friends />} />
  	    <Route path="*" element={<NotFound />} />
  	  </Routes>
			<InvitPopup />
		</>
  ) : (
		<Routes>
			<Route path="/" element={<User />} />
      <Route path="/auth" element={<Auth />} />
	    <Route path="*" element={<NotFound />} />
		</Routes>
	);
}

export default App;
