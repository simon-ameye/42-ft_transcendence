import { BrowserRouter, Route, Routes } from 'react-router-dom'
import User from './components/User';
<<<<<<< HEAD
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Game from './pages/Game';
import io from 'socket.io-client';
import Auth from './components/Auth';

export const socket = io('http://localhost:4343');

function App() {

  return (
    <BrowserRouter>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/user" element={<User />} />
			<Route path="/game" element={<Game />} />
			<Route path="/auth" element={<Auth />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
  );
=======
import NotFound from './pages/notFound';
import Home from './pages/home';
import Game from './pages/pong';
import Chat from './pages/chat';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/user" element={<User />} />
				<Route path="/game" element={<Game />} />
				<Route path="/chat" element={<Chat />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
>>>>>>> main
}

export default App;
