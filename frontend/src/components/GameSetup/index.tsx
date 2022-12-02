import Default from '../../layouts/Default';
import { useMemo, useState } from 'react';
import GameEngine from '../GameEngine';
import './style.scss'
import { GameConfig } from '../interface/gameConfig';

const Game = () => {

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
		players: 0
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