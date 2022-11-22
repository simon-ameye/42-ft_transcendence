import { useEffect, useState } from "react"
import GameDisplay, { GameConfig } from "../GameDisplay"

const GameEngine = (props: { p1y:number, p2y:number, config: GameConfig }) => {
	const [ball, setBall] = useState({
		x: props.config.canvasSize.x / 2 - props.config.ballSize.x / 2,
		y: props.config.canvasSize.y / 2 - props.config.ballSize.y / 2
	})
	const [ballDirection, setBallDirection] = useState({x: 10, y: 10})

	const bounce = () => {
		setBallDirection({x: 10, y: -10})
	}

	useEffect(() => {
		const interval = setInterval(() => {
		if (ball.y + props.config.ballSize.x <= 0 || ball.y + props.config.ballSize.x >= props.config.canvasSize.y)
			bounce()
		setBall({x: ball.x + ballDirection.x, y: ball.y + ballDirection.y});
		}, 200)
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