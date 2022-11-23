import { BrowserRouter, Route, Routes } from 'react-router-dom'
import User from './components/User';
import NotFound from './pages/notFound';
import Home from './pages/home';
import Game from './pages/Game';
import io from 'socket.io-client';
import Auth from './components/Auth';
import axios from 'axios';
import ChatBox from './components/Chat/ChatBox'
import Channel from './components/Chat/Channel/Channel';
import Chat from './components/Chat/Chat';

axios.defaults.withCredentials = true;

export const socket = io('http://localhost:4343');
console.log("socket value", socket);

function App() {

  return (
   <BrowserRouter>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/user" element={<User />} />
			<Route path="/game" element={<Game />} />
			<Route path="/auth" element={<Auth />} />
      <Route path="/ChatBox" element={<ChatBox />} />
			<Route path="/Chat" element={<Chat />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
  );
}

export default App;
