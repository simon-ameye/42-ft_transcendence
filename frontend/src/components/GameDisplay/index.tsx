import { useCallback, useEffect, useRef } from "react"

export interface Position {
	x: number;
	y: number;
}

interface ObjectSize extends Position { };

export interface GameConfig {
	paddleSize: ObjectSize;
	paddleOffset: number;
	canvasSize: ObjectSize;
	ballSize: ObjectSize;
	bgColor: string;
	fgColor: string;
};

const LINE_WIDTH = 1;
const LINE_OFFSET = 30;

const GameDisplay = (props: { p1y: number, p2y: number, ball: Position, config: GameConfig }) => {
	const canvas = useRef<HTMLCanvasElement>(null);

	const { canvasSize, ballSize, bgColor, fgColor, paddleOffset, paddleSize } = props.config;

	const drawRect = (context: CanvasRenderingContext2D, pos: Position, size: ObjectSize, color: string) => {
		context.fillStyle = color;
		context.fillRect(pos.x, pos.y, size.x, size.y);
	}

	const drawAll = useCallback((context: CanvasRenderingContext2D) => {
		// Background
		drawRect(context, { x: 0, y: 0 }, { x: canvasSize.x, y: canvasSize.y }, bgColor);

		// Line
		drawRect(
			context,
			{
				x: canvasSize.x / 2 + LINE_WIDTH / 2,
				y: LINE_OFFSET
			},
			{
				x: LINE_WIDTH,
				y: canvasSize.y - LINE_OFFSET * 2
			},
			fgColor
		);

		// P1
		drawRect(context, { x: paddleOffset, y: props.p1y }, paddleSize, fgColor);

		// P2
		drawRect(context, { x: canvasSize.x - paddleOffset * 2, y: props.p2y }, paddleSize, fgColor);

		// Ball
		drawRect(context, props.ball, ballSize, fgColor);

	}, [props.ball, props.p1y, props.p2y, canvasSize, ballSize, bgColor, fgColor, paddleOffset, paddleSize])

	useEffect(() => {
		const canvasCurrentRef = canvas.current
		if (!canvasCurrentRef) return;

		const context = canvasCurrentRef.getContext('2d');
		if (!context) return;

		drawAll(context);

	}, [canvas, drawAll])

	return <canvas width={canvasSize.x} height={canvasSize.y} ref={canvas}></canvas>
}

export default GameDisplay