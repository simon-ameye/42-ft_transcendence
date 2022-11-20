import { BrowserRouter, Route, Routes } from 'react-router-dom'
import User from './components/User';
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
}

export default App;
