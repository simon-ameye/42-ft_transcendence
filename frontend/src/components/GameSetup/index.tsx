import AuthenticatedLayout from '../../layouts/Authenticated';
import { GameConfig } from '../GameDisplay';
import { useMemo } from 'react';
import GameEngine from '../GameEngine';

const Game = () => {
	const gameConfig: GameConfig = useMemo(() => ({
		canvasSize: {
			x: 1000,
			y: 600,
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
		bgColor: '#333',
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