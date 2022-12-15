import Default from '../../layouts/Default';
import { useMemo } from 'react';
import GameEngine from '../GameEngine';
import './style.scss'
import { GameConfig } from '../../interfaces/gameConfig';
import useWindowSize from 'react-use/lib/useWindowSize'

const Game = () => {
	const { width, height } = useWindowSize()
	const gameConfig: GameConfig = useMemo(() => ({
		canvasSize: {
			x: width / 2,
			y: (width / 2) / 1.6,
		},
		paddleOffset: width * (1 / 100),
		paddleSize: {
			x: width * (1.2 / 100),
			y: width * (8 / 100),
		},
		ballSize: {
			x: width * (1.2 / 100),
			y: width * (1.2 / 100)
		},
		scoreP1: 0,
		scoreP2: 0,
		p1PosY: (((width / 2) / 1.6) / 2) - (width * (8 / 100)) / 2,
		p2PosY: (((width / 2) / 1.6) / 2) - (width * (8 / 100)) / 2,
		bgColor: "#333",
		fgColor: '#fff',
		players: 2
	}), [width, height])

	return (
		<Default>
			<GameEngine
				config={gameConfig}
			/>
		</Default>
	);
};

export default Game;