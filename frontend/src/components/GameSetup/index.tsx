import Default from '../../layouts/Default';
import { useMemo, useState, useEffect } from 'react';
import GameEngine from '../GameEngine';
import './style.scss'
import { GameConfig } from '../interface/gameConfig';
import { socket } from '../../App';
import PlayerInterface from '../../interfaces/player.interface';
import { useCookies } from 'react-cookie';

const Game = () => {

	// VARIABLES \\
	
	const	[cookie] = useCookies(['displayName']);
	const [rerender, setRerender] = useState<boolean>(false);
	const [playerRight, setPlayerRight] =
			useState<PlayerInterface>({userId: 0, displayName: "right", score: 0, side: 0});
	const [playerLeft, setPlayerLeft] =
			useState<PlayerInterface>({userId: 0, displayName: "left", score: 0, side: 0});
	const [playing, setPlaying] = useState<boolean>(false);

	// USE_EFFECT \\

	useEffect(() => {
		socket.on('game started', gameStartedListener);
		return () => {
			socket.off('game started', gameStartedListener);
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
		if (players[1].side) {
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
		setRerender(!rerender);
		setPlaying(true);
	}

	const	isPlayingListener = (playing: boolean) => {
		setPlaying(playing);
		console.log({playing: playing});
		if (playing)
			socket.emit('get players');
	}

	const gameConfig: GameConfig = useMemo(() => ({
		canvasSize: {
			x: window.innerWidth / 2,
			y: window.innerHeight / 1.6,
		},
		paddleOffset: 20,
		paddleSize: {
			x: 20,
			y: 150,
		},
		ballSize: {
			x: 20,
			y: 20
		},
		scoreP1: 0,
		scoreP2: 0,
		p1PosY: (window.innerHeight / 1.6) / 2 - (150 / 2),
		p2PosY: (window.innerHeight / 1.6) / 2 - (150 / 2),
		bgColor: "#333",
		fgColor: '#fff',
		players: 2,
		players2: [playerRight, playerLeft],
	}), [])

	return (
		<Default>
			<GameEngine
				config={gameConfig}
			/>
		</Default>
	);
};

export default Game;
