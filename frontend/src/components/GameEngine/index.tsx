import { useEffect, useState } from "react"
import GameDisplay, { GameConfig } from "../GameDisplay"

const GameEngine = (props: { config: GameConfig }) => {
	const ballInitialX = props.config.canvasSize.x / 2 - props.config.ballSize.x
	const ballInitialY = props.config.canvasSize.y / 2 - props.config.ballSize.y

	const [ball, setBall] = useState({ x: ballInitialX, y: ballInitialY })
	const [ballDirection, setBallDirection] = useState({ x: 5, y: 5 })

	const isGoalP1: boolean = ball.x + props.config.ballSize.x + ballDirection.x > props.config.canvasSize.x
	const isGoalP2: boolean = ball.x + ballDirection.x < 0
	const yTopBorder: boolean = ball.y + ballDirection.y < 0;
	const yBottomBorder: boolean = ball.y + props.config.ballSize.y + ballDirection.y > props.config.canvasSize.y;

	const bounceY = () => {
		setBallDirection({ x: ballDirection.x, y: ballDirection.y * -1 })
	}

	const bounceX = () => {
		setBallDirection({ x: ballDirection.x * - 1, y: ballDirection.y })
	}

	const scored = (player: string) => {
		//Reset ball position to center
		setBall({ x: ball.x = ballInitialX, y: ball.y = Math.floor(Math.random() * (props.config.canvasSize.y - props.config.ballSize.x + 1)) + 1 })
		setBallDirection({ x: ballDirection.x, y: ballDirection.y * -1 })
		// Add points to player
		if (player === "P1")
			props.config.scoreP1++;
		else
			props.config.scoreP2++
	}

	const isRightPaddle = () => {
		const ballTopRight = { x: ball.x + props.config.ballSize.x + ballDirection.x, y: ball.y }
		const rect = { x: props.config.canvasSize.x - props.config.paddleOffset * 2, y: props.config.p2PosY, w: props.config.canvasSize.x - props.config.paddleOffset, h: props.config.paddleSize.y + props.config.p2PosY }

		const isIn: boolean = (
			(ballTopRight.x > rect.x && ballTopRight.x < rect.w) && (ballTopRight.y > rect.y && ballTopRight.y < rect.h)
		)
		return isIn
	}

	const isLeftPaddle = () => {
		const ballTopLeft = { x: ball.x + ballDirection.x, y: ball.y }
		const rect = { x: props.config.paddleOffset, y: props.config.p1PosY, w: props.config.paddleOffset * 2, h: props.config.paddleSize.y + props.config.p1PosY }

		const isIn: boolean = (
			(ballTopLeft.x > rect.x && ballTopLeft.x < rect.w) && (ballTopLeft.y > rect.y && ballTopLeft.y < rect.h)
		)
		return isIn
	}

	useEffect(() => {
		const interval = setInterval(() => {
			if (yTopBorder || yBottomBorder)
				bounceY()
			else if (isRightPaddle() || isLeftPaddle())
				bounceX()
			else if (isGoalP1)
				scored("P1")
			else if (isGoalP2)
				scored("P2")
			setBall({ x: ball.x + ballDirection.x, y: ball.y + ballDirection.y });
		}, 10)
		return () => clearInterval(interval);
	});

	return <GameDisplay
		ball={ball}
		config={props.config}
	/>
}

export default GameEngine