export interface gameData {
	canvas: HTMLCanvasElement;
	paddle1: elementProps;
	paddle2: elementProps;
	ball: elementProps;
	score1: number;
	score2: number;
}

export interface elementProps {
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
	speed: number;
	gravity: number;
}