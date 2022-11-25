import AuthenticatedLayout from '../../layouts/Authenticated';
import { GameConfig } from '../GameDisplay';
import { useMemo, useState } from 'react';
import GameEngine from '../GameEngine';
import './style.scss'

const Game = () => {
	const [color, setColor] = useState("#333");
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
		bgColor: color,
		fgColor: '#fff'
	}), [color])

	return (
		<AuthenticatedLayout>
			<GameEngine
				config={gameConfig}
			/>
			<div className="color-palette">
				<ul className="color-list">
					<li className='color1' onClick={() => {setColor("#000")}}></li>
					<li className='color2' onClick={() => {setColor("#342264")}}></li>
					<li className='color3' onClick={() => {setColor("#30501d")}}></li>
					<li className='color4' onClick={() => {setColor("#333")}}></li>
				</ul>
			</div>
		</AuthenticatedLayout>
	);
};

export default Game;