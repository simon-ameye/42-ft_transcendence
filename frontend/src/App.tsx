import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import User from './components/User';
import Notifications from './components/Notifications';
import Chat from './pages/chat';
import Home from './pages/home';
import NotFound from './pages/notFound';
import Game from './pages/Game';
import LiveGame from './components/AbrunGame/live-game.component';
import io from 'socket.io-client';
import Auth from './components/Auth';
import axios from 'axios';
import Profile from './components/Profile';

axios.defaults.withCredentials = true;

export let socket = io('http://localhost:4343', { withCredentials: true });

function App() {
	socket.emit('hello');

	useEffect(() => {
		socket.on("heyo", heyoListener);
		return () => {
			socket.off("heyo", heyoListener);
		}
	})

	const heyoListener = () => {
		axios.put('http://localhost:3001/user/modifySocketId', {
			socketId: socket.id
		})
			.then(res => socket.emit('is playing'))
			.catch(err => console.log(err));
	}

  return (
   <BrowserRouter>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/user" element={<User />} />
			<Route path="/game" element={<Game />} />
			<Route path="/game/live" element={<LiveGame />} />
			<Route path="/auth" element={<Auth />} />
			<Route path="/notifications" element={<Notifications />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
  );
}

export default App;
