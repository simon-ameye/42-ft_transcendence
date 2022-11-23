import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home';
import User from './components/User';
import Game from './components/GameSetup';
import NotFound from './components/NotFound';

function App() {
  return (
    <BrowserRouter>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/user" element={<User />} />
			<Route path="/game" element={<Game />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
  );
}

export default App;