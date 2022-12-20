import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import Home from './components/Home';
import User from './components/User';
import io from 'socket.io-client';
import Auth from './components/Auth';
import axios from 'axios';
import GameLive from './components/GameSetup';
import ChatBox from './components/Chat/ChatBox'
import Profile from './components/Profile'
import NotFound from './components/NotFound';
import Game from './components/GameSetup';
import { useCookies } from 'react-cookie';
import Friends from './components/Friends';
import PublicProfile from './components/Profile/public';

axios.defaults.withCredentials = true;

export let socket = io('http://localhost:4343', { withCredentials: true });

function App() {

	// ON INIT \\

	socket.emit('hello');

	// VARIABLES \\
	const [cookie, setCookie] = useCookies(['displayName', 'jwtToken']);

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

	// LISTENER \\

	const heyoListener = () => {
		axios.put('http://localhost:3001/user/modifySocketId', {
			socketId: socket.id
		})
			.then(res => socket.emit('is playing'))
			.catch(err => console.log(err));
	}

	const reloadListener = () => {
		window.location.reload();
	}

  return cookie.displayName ? (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Home />} />
        <Route path="/ChatBox" element={<ChatBox />} />
        <Route path="/Profile" element={<Profile />} />
				<Route path="/game" element={<Game />} />
				<Route path="/game/live" element={<GameLive />} />
				<Route path="/friends" element={<Friends />} />
				<Route path="/publicProfile/:id" element={<PublicProfile/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  ) : (
    <BrowserRouter>
			<Routes>
				<Route path="/" element={<User />} />
        <Route path="/auth" element={<Auth />} />
  	    <Route path="*" element={<NotFound />} />
			</Routes>
    </BrowserRouter>
	);
}

export default App;
