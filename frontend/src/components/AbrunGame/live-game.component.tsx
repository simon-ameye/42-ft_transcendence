import React, { useState, useEffect } from 'react';
import { socket } from '../../App';
import PlayerInterface from '../../interfaces/player.interface';

export default function	LiveGame() {

	// VARIABLES \\
	
	const [rerender, setRerender] = useState<boolean>(false);
	const [playerRight, setPlayerRight] =
			useState<PlayerInterface>({socketId: "right", score: 0});
	const [playerLeft, setPlayerLeft] =
			useState<PlayerInterface>({socketId: "left", score: 0});
	const [spectator, setSpectator] = useState<boolean>(false);

	// FUNCTIONS \\

	const addPoint = (ssocketIde: string) => {
		if (ssocketIde === 'right')
			socket.emit("add point", playerRight);
		else
			socket.emit("add point", playerLeft);
	}

	// USE_EFFECT \\

	useEffect(() => {
		socket.on('game started', gameStartedListener);
		return () => {
			socket.off('game started', gameStartedListener);
		}
	});

	useEffect(() => {
		socket.on('update score', updateScoreListener);
		return () => {
			socket.off('update score', updateScoreListener);
		}
	});

	// LISTENER \\

	const gameStartedListener = (players: PlayerInterface[]) => {
		playerRight.socketId = players[0].socketId;
		playerLeft.socketId = players[1].socketId;
		playerRight.score = players[0].score;
		playerLeft.score = players[1].score;
		setPlayerRight(playerRight);
		setPlayerLeft(playerLeft);
		if (socket.id !== playerRight.socketId && socket.id !== playerLeft.socketId)
			setSpectator(true);
		setRerender(!rerender);
	}

	const updateScoreListener = (player: PlayerInterface) => {
		if (player.socketId === playerRight.socketId) {
			playerRight.score = player.score;
			setPlayerRight(playerRight);
		}
		else {
			playerLeft.score = player.score;
			setPlayerLeft(playerLeft);
		}
		setRerender(!rerender);
	}

	// RETURN \\

	return (spectator) ? (
		<>
			<div>
				<h2>LIVE GAME AS SPECTATOR</h2>
			</div>
			<div>
				<h5>{playerRight.socketId}: {playerRight.score}</h5>
				<h5>{playerLeft.socketId}: {playerLeft.score}</h5>
			</div>
		</>
	) : (
		<>
			<div>
				<h2>LIVE GAME</h2>
			</div>
			<div>
				<h5>{playerRight.socketId}: {playerRight.score}</h5>
				<button onClick={() => addPoint('right')}>RIGHT</button>
				<h5>{playerLeft.socketId}: {playerLeft.score}</h5>
				<button onClick={() => addPoint('left')}>LEFT</button>
			</div>
		</>
	)
}