import React from 'react';
import io from 'socket.io-client';
import MatchingQueue from './components/matching-queue.component';
import LiveGame from './components/live-game.component';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export const socket = io('http://localhost:4343');

function App() {

	return (
		<Router>
			<Routes>
				<Route path="/" element={<MatchingQueue />}/>
				<Route path="/live" element={<LiveGame  />}/>
			</Routes>
		</Router>
	)
}

export default App;
