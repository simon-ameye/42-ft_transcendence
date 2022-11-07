import { BrowserRouter, Route, Routes } from 'react-router-dom'
import User from './components/User';
import NotFound from './pages/notFound';
import Home from './pages/home';
import Game from './pages/game';
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
}

export default App;