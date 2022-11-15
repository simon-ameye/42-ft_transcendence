import React from 'react';
import io from 'socket.io-client';
import MatchingQueue from './components/matching-queue.component';
import InvitPopup from './components/invit-popup.component';
import LiveGame from './components/live-game.component';

export const socket = io('http://localhost:4343');

function App() {

	return (
		<>
			<MatchingQueue />
			<InvitPopup />
			<LiveGame  />
		</>
	)
}

export default App;
