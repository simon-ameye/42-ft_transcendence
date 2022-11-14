import React from 'react';
import LiveGameInterface from '../interfaces/live-game.interface';

export default function	LiveGame(
		{trigger, playerRight, playerLeft, addPoint } : LiveGameInterface)
{
	return (trigger) ? (
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
