import React, { useState, useEffect } from 'react';
import { socket } from '../App';
import Player from '../interfaces/player.interface';

export default function	LiveGame() {

	// VARIABLES \\
	
	const [rerender, setRerender] = useState<boolean>(false);
	const [live, setLive] = useState<boolean>(false);
	const [playerRight, setPlayerRight] =
			useState<Player>({id: "right", score: 0});
	const [playerLeft, setPlayerLeft] =
			useState<Player>({id: "left", score: 0});

	// FUNCTIONS \\

	const addPoint = (side: string) => {
		if (side === 'right')
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

	const gameStartedListener = (ids: string[]) => {
		playerRight.id = ids[0];
		playerLeft.id = ids[1];
		setPlayerRight(playerRight);
		setPlayerLeft(playerLeft);
		setLive(true);
		setRerender(!rerender);
	}

	const updateScoreListener = (player: Player) => {
		if (player.id === playerRight.id) {
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

	return (live) ? (
		<>
			<div>
				<h2>LIVE GAME</h2>
			</div>
			<div>
				<h5>{playerRight.id}: {playerRight.score}</h5>
				<button onClick={() => addPoint('right')}>RIGHT</button>
				<h5>{playerLeft.id}: {playerLeft.score}</h5>
				<button onClick={() => addPoint('left')}>LEFT</button>
			</div>
		</>
	) : <></>;
}
