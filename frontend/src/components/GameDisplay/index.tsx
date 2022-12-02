import { useCallback, useEffect, useRef, useState } from "react"
import { GameConfig } from "../interface/gameConfig";
import { ObjectSize, Position } from "../interface/position";
import "./style.scss"

const LINE_WIDTH = 1;
const LINE_OFFSET = 30;

const GameDisplay = (props: { ball: Position, config: GameConfig }) => {
	const [backColor, setBackColor] = useState("#333333");
	const [compColor, setCompColor] = useState("#ffffff");
	const [mode, setMode] = useState("Player vs Player")

	const canvas = useRef<HTMLCanvasElement>(null);

	const { canvasSize, ballSize, bgColor, fgColor, paddleOffset, paddleSize, p2PosY, p1PosY } = props.config;

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

	}, [props.ball, p1PosY, p2PosY, canvasSize, ballSize, bgColor, fgColor, paddleOffset, paddleSize])

	useEffect(() => {
		const canvasCurrentRef = canvas.current
		if (!canvasCurrentRef) return;

		const context = canvasCurrentRef.getContext('2d');
		if (!context) return;

		drawAll(context);

	}, [canvas, drawAll])

	const botMovements = () => {
		if (props.config.p2PosY > 0 - props.config.paddleSize.y) {
			props.config.p2PosY = props.ball.y - props.config.paddleSize.y / 2
		}
		else if (props.config.p2PosY <= 0) {
			props.config.p2PosY = props.config.canvasSize.y
		}
	}
	if (props.config.players == 1)
		botMovements()

	const resetGame = () => {
		props.ball.x = props.config.canvasSize.x / 2 - props.config.ballSize.x
		props.ball.y = (window.innerHeight / 1.6) / 2 - (150 / 2)
		props.config.scoreP1 = 0
		props.config.scoreP2 = 0
		props.config.p1PosY = (window.innerHeight / 1.6) / 2 - (150 / 2)
		props.config.p2PosY = (window.innerHeight / 1.6) / 2 - (150 / 2)
	}
	const changeMode = () => {
		if (mode === "Player vs Cheater") {
			setMode("Player vs Player")
			props.config.players = 2
		}
		else {
			setMode("Player vs Cheater")
			props.config.players = 1
		}
		resetGame()
	}
	props.config.bgColor = backColor;
	props.config.fgColor = compColor;
	return (
		<>
			<div className='gameMode' style={{ width: window.innerWidth / 2 }}>
				<label>Change mode :</label>
				<button onClick={changeMode}>{mode}</button>
			</div>
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