import { GameConfig, Position } from "../GameDisplay";

export default class Pong {
	p1y: number;
	p2y: number;
	ball: Position;
	ballDirection: Position = { x: 10, y: 10 };
	config: GameConfig;

	constructor(config: GameConfig, p1y = 0, p2y = 0) {
		this.config = config
		this.p1y = p1y;
		this.p2y = p2y;
		this.ball = {
			x: config.canvasSize.x / 2 - config.ballSize.x / 2,
			y: config.canvasSize.y / 2 - config.ballSize.y / 2
		}
	}

	getFrame() {
		console.log('tick', { b: this.ball, bd: this.ballDirection })

		// this.ball.x += this.ballDirection.x;
		// this.ball.y += this.ballDirection.y;

		return {
			p1y: this.p1y,
			p2y: this.p2y,
			ball: this.ball,
		}
	}
}
