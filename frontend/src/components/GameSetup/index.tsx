import AuthenticatedLayout from '../../layouts/Authenticated';
import { useMemo } from 'react';
import GameEngine from '../GameEngine';
import './style.scss'
import { GameConfig } from '../interface/gameConfig';

const Game = () => {
	const gameConfig: GameConfig = useMemo(() => ({
		canvasSize: {
			x: window.innerWidth / 2,
			y: window.innerHeight / 1.6,
		},
		paddleOffset: 30,
		paddleSize: {
			x: 30,
			y: 175,
		},
		ballSize: {
			x: 30,
			y: 30
		},
		scoreP1: 0,
		scoreP2: 0,
		p1PosY: 300 - (175 / 2),
		p2PosY: 300 - (175 / 2),
		bgColor: "#333",
		fgColor: '#fff'
	}), [])

	return (
		<AuthenticatedLayout>
			<GameEngine
				config={gameConfig}
			/>
		</AuthenticatedLayout>
	);
};

export default Game;