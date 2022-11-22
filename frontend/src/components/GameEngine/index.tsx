import { useEffect, useState } from "react"
import GameDisplay, { GameConfig } from "../GameDisplay"

const GameEngine = (props: { p1y: number, p2y: number, config: GameConfig }) => {
	const [ball, setBall] = useState({
		x: props.config.canvasSize.x / 2 - props.config.ballSize.x / 2,
		y: props.config.canvasSize.y / 2 - props.config.ballSize.y / 2
	})
	const [ballDirection, setBallDirection] = useState({ x: 5, y: 5 })

	const bounceY = () => {
		setBallDirection({ x: ballDirection.x, y: ballDirection.y * -1 })
	}

	const bounceX = () => {
		setBallDirection({ x: ballDirection.x * -1, y: ballDirection.y })
	}

	useEffect(() => {
		const interval = setInterval(() => {
			if (ball.y + ballDirection.y < 0 || ball.y + props.config.ballSize.y + ballDirection.y > props.config.canvasSize.y)
				bounceY()
			if (ball.x + ballDirection.x < 0 || ball.x + props.config.ballSize.x + ballDirection.x > props.config.canvasSize.x)
				bounceX()
			setBall({ x: ball.x + ballDirection.x, y: ball.y + ballDirection.y });
		}, 8)
		return () => clearInterval(interval);
	});

	return <GameDisplay
		p1y={props.p1y}
		p2y={props.p2y}
		ball={ball}
		config={props.config}
	/>
}

export default GameEngine