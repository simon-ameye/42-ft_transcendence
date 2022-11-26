import { BrowserRouter, Route, Routes } from 'react-router-dom'
import User from './components/User';
import Notifications from './components/Notifications';
import Game from './pages/pong';
import Chat from './pages/chat';
import Home from './pages/home';
import NotFound from './pages/notFound';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/notifications" element={<Notifications />} />
        <Route path="/user" element={<User />} />
				<Route path="/game" element={<Game />} />
				<Route path="/chat" element={<Chat />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;