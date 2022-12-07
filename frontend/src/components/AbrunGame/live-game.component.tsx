import React, { useState, useEffect } from 'react';
import { socket } from '../../App';
import PlayerInterface from '../../interfaces/player.interface';
import { useCookies } from 'react-cookie';

export default function	LiveGame() {

	// VARIABLES \\
	
	const	[cookie] = useCookies(['displayName']);
	const [rerender, setRerender] = useState<boolean>(false);
	const [playerRight, setPlayerRight] =
			useState<PlayerInterface>({userId: 0, displayName: "right", score: 0});
	const [playerLeft, setPlayerLeft] =
			useState<PlayerInterface>({userId: 0, displayName: "left", score: 0});
	const [spectator, setSpectator] = useState<boolean>(false);
	const [playing, setPlaying] = useState<boolean>(false);

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

	useEffect(() => {
		socket.on('is playing', isPlayingListener);
		return () => {
			socket.off('is playing', isPlayingListener);
		}
	});

	// LISTENER \\

	const gameStartedListener = (players: PlayerInterface[]) => {
		var	r = 1;
		var	l = 0;
		if (cookie.displayName == players[0].displayName) {
			r = 0;
			l = 1;
		}
		playerRight.displayName = players[r].displayName;
		playerLeft.displayName = players[l].displayName;
		playerRight.userId = players[r].userId;
		playerLeft.userId = players[l].userId;
		playerRight.score = players[r].score;
		playerLeft.score = players[l].score;
		setPlayerRight(playerRight);
		setPlayerLeft(playerLeft);
	//	if (socket.id !== playerRight.socketId && socket.id !== playerLeft.socketId)
		//	setSpectator(true);
		setRerender(!rerender);
		setPlaying(true);
	}

	const updateScoreListener = (player: PlayerInterface) => {
		if (player.userId === playerRight.userId) {
			playerRight.score = player.score;
			setPlayerRight(playerRight);
		}
		else {
			playerLeft.score = player.score;
			setPlayerLeft(playerLeft);
		}
		setRerender(!rerender);
	}

	const	isPlayingListener = (playing: boolean) => {
		setPlaying(playing);
		console.log({playing: playing});
		if (playing)
			socket.emit('get players');
	}

	// RETURN \\

	return (spectator) ? (
		<>
			<div>
				<h2>LIVE GAME AS SPECTATOR</h2>
			</div>
			<div>
				<h5>{playerRight.displayName}: {playerRight.score}</h5>
				<h5>{playerLeft.displayName}: {playerLeft.score}</h5>
			</div>
		</>
	) : (playing) ? (
		<>
			<div>
				<h2>LIVE GAME</h2>
			</div>
			<div>
				<h5>{playerRight.displayName}: {playerRight.score}</h5>
				<button onClick={() => addPoint('right')}>RIGHT</button>
				<h5>{playerLeft.displayName}: {playerLeft.score}</h5>
				<button onClick={() => addPoint('left')}>LEFT</button>
			</div>
		</>
	) : (
		<>
			<h1>You're not allowed to be here</h1>
		</>
	)
}
