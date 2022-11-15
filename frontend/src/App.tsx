import React, { useState, useEffect, createContext } from 'react';
import io, { Socket } from 'socket.io-client';
import './App.css';
import MatchingQueue from './components/matching-queue.component';
import axios from 'axios';
import InvitPopup from './components/invit-popup.component';
import LiveGame from './components/live-game.component';
import Player from './interfaces/player.interface';

export const socket = io('http://localhost:4343');

function App() {
	const [rerender, setRerender] = useState<boolean>(false);
	const [count, setCount] = useState(0);
	const [live, setLive] = useState<boolean>(true);
	const [playerRight, setPlayerRight] =
			useState<Player>({id: "right", score: 0});
	const [playerLeft, setPlayerLeft] =
			useState<Player>({id: "left", score: 0});

	const [invit, setInvit] = useState<boolean>(false)
	const [invitText, setInvitText] = useState<string>("")

	// COMPONENTS INVIT-POPUP \\

	useEffect(() => {
		socket?.on("send invitation", invitListener);
		return () => {
			socket?.off("send invitation", invitListener);
		}
	})

	const invitListener = (socketId: string) => {
		setInvitText("You receive an invitation to pong game from ".concat(socketId));
		setInvit(true);
	}

	const removeInvitPopup = () => {
		setInvit(false);
	}

	const acceptInvit = () => {
		if (socket !== undefined) {
			const invitTextArray = invitText.split(" ");
			const	senderId = invitTextArray[invitTextArray.length - 1];
			socket.emit("invitation accepted", senderId);
		}
		setInvit(false);
	}

	useEffect(() => {
		socket?.on("invitation accepted sender",
				invitAcceptedSenderListener);
		return () => {
			socket?.off("invitation accepted sender",
					invitAcceptedSenderListener);
		}
	})

	const	invitAcceptedSenderListener = (gameRoom: string) => {
		socket?.emit("invitation accepted sender", gameRoom);
	}

	// COMPONENTS LIVE GAME \\


//	const addPoint = (side: string) => {
//		if (side === 'right') {
//			++playerRight.score;
//			setPlayerRight(playerRight);
//		} else
//		{
//			++playerLeft.score;
//			setPlayerLeft(playerLeft);
//		}
//		setRerender(!rerender);
//	}

	const addPoint = (side: string) => {
		if (side === 'right')
			socket?.emit("add point", playerRight);
	}

	return (
		<>
			<MatchingQueue />
			<InvitPopup
				trigger={invit}
				removeInvitPopup={removeInvitPopup}
				invitText={invitText}
				acceptInvit={acceptInvit} />
			<LiveGame trigger={live}
				playerRight={playerRight}
				playerLeft={playerLeft}
				addPoint={addPoint} />
		</>
	)
}

export default App;
