import AuthenticatedLayout from '../layouts/Authenticated';
import { GameConfig } from '../components/GameDisplay';
import { useMemo } from 'react';
import GameEngine from '../components/GameEngine';

const GamePage = () => {
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
		bgColor: '#333',
		fgColor: '#fff'
	}), [])

	return (
		<AuthenticatedLayout>
			<GameEngine
				p1y={0}
				p2y={0}
				config={gameConfig}
			/>
		</AuthenticatedLayout>
	);
};

export default GamePage;