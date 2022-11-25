import { useCallback, useEffect, useRef, useState } from "react"
import { GameConfig } from "../interface/gameConfig";
import { ObjectSize, Position } from "../interface/position";
import "./style.scss"

const LINE_WIDTH = 1;
const LINE_OFFSET = 30;

const GameDisplay = (props: { ball: Position, config: GameConfig }) => {
	const [backColor, setBackColor] = useState("#333333");
	const [compColor, setCompColor] = useState("#ffffff");

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

	props.config.bgColor = backColor;
	props.config.fgColor = compColor;
	return (
		<>
			<div className="score" style={{ width: canvasSize.x }}>
				<h1 className="score-1">{props.config.scoreP1}</h1>
				<h1 className="score-p2">{props.config.scoreP2}</h1>
			</div>
			<canvas width={canvasSize.x} height={canvasSize.y} ref={canvas} />
			<div className="color" style={{ width: canvasSize.x }}>
				<div className="background-color">
					<label>background color :</label>
					<input type="color" value={backColor} onChange={e => setBackColor(e.target.value)} />
				</div>
				<div className="pad-ball-color">
					<label>pad/ball color :</label>
					<input type="color" value={compColor} onChange={e => setCompColor(e.target.value)} />
				</div>
			</div>
		</>
	)
}

export default GameDisplay