import { useCallback, useEffect, useRef } from "react"
import "./style.scss"

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
	scoreP1: number,
	scoreP2: number,
	p1PosY: number,
	p2PosY: number,
	bgColor: string;
	fgColor: string;
};

const LINE_WIDTH = 1;
const LINE_OFFSET = 30;

const GameDisplay = (props: { ball: Position, config: GameConfig }) => {
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
		drawRect(context, { x: paddleOffset, y: props.config.p1PosY }, paddleSize, fgColor);

		// P2
		drawRect(context, { x: canvasSize.x - paddleOffset * 2, y: props.config.p2PosY }, paddleSize, fgColor);

		// Ball
		drawRect(context, props.ball, ballSize, fgColor);

	}, [props.ball, props.config.p1PosY, props.config.p2PosY, canvasSize, ballSize, bgColor, fgColor, paddleOffset, paddleSize])

	useEffect(() => {
		const canvasCurrentRef = canvas.current
		if (!canvasCurrentRef) return;

		const context = canvasCurrentRef.getContext('2d');
		if (!context) return;

		drawAll(context);

	}, [canvas, drawAll])

	return (
		<>
			<div className="score" style={{ width: canvasSize.x }}>
				<h1 className="score-1">{props.config.scoreP1}</h1>
				<h1 className="score-p2">{props.config.scoreP2}</h1>
			</div>
			<canvas width={canvasSize.x} height={canvasSize.y} ref={canvas}></canvas>
		</>
	)
}

export default GameDisplay