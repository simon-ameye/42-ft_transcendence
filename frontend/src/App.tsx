import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import User from './components/User';
import Notifications from './components/Notifications';
import NotFound from './pages/NotFound';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/user" element={<User />} />
			<Route path="/notifications" element={<Notifications />} />
			{/*<Route path="/game" element={<Game />} />*/}
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
  );
}

export default App;