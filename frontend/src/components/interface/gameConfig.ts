import { ObjectSize } from './position';
import PlayerInterface from '../../interfaces/player.interface';

export interface GameConfig {
	paddleSize: ObjectSize,
	paddleOffset: number,
	canvasSize: ObjectSize,
	ballSize: ObjectSize,
	bgColor: string,
	fgColor: string,
	players2: PlayerInterface[],
};
