import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CreateUser from './components/CreateUser';
import NotFound from './pages/NotFound';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
		<Routes>
			<Route path="/" exact element={<Home />} />
			<Route path="/createuser" element={<CreateUser />} />
			{/*<Route path="/game" element={<Game />} />*/}
			<Route path="*" element={<NotFound />} />
		</Routes>
	</BrowserRouter>
  );
}

export default App;