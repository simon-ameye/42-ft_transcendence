import { useEffect, useState } from "react"
import GameDisplay from "../GameDisplay"
import { useKeyDown } from "../hooks/useKeyDown"
import { GameConfig } from "../../interfaces/gameConfig"
import Confetti from 'react-confetti'
import "./style.scss"
import useWindowSize from 'react-use/lib/useWindowSize'

const GameEngine = (props: { config: GameConfig }) => {
	const { width, height } = useWindowSize()

	const ballInitialX = props.config.canvasSize.x / 2 - props.config.ballSize.x
	const ballInitialY = props.config.canvasSize.y / 2 - props.config.ballSize.y
	
	const [ball, setBall] = useState({ x: ballInitialX, y: ballInitialY })
	const [ballDirection, setBallDirection] = useState({ x: 5, y: 5 })
	const [isWinner, setIsWinner] = useState("")

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
		// Add points to player
		if (player === "P1")
			props.config.scoreP1++
		else
			props.config.scoreP2++
		//Reset ball position to center
		setBall({ x: ball.x = ballInitialX, y: ball.y = Math.floor(Math.random() * (props.config.canvasSize.y - props.config.ballSize.x + ballDirection.x)) + 1 })
		setBallDirection({ x: ballDirection.x, y: ballDirection.y * -1 })
		if (props.config.scoreP1 === 7 || props.config.scoreP2 === 7)
			props.config.scoreP1 === 7 ? setIsWinner("P1") : setIsWinner("P2")
	}

	const isRightPaddle = () => {
		const rect = { x: props.config.canvasSize.x - props.config.paddleOffset * 2, y: props.config.p2PosY, w: props.config.canvasSize.x - props.config.paddleOffset, h: props.config.paddleSize.y + props.config.p2PosY }

		const isIn: boolean =
			(ball.x + props.config.ballSize.x + ballDirection.x > rect.x && ball.x + props.config.ballSize.x + ballDirection.x < rect.w) && (ball.y > rect.y && ball.y < rect.h)

		return isIn
	}

	const isLeftPaddle = () => {
		const rect = { x: props.config.paddleOffset, y: props.config.p1PosY, w: props.config.paddleOffset * 2, h: props.config.paddleSize.y + props.config.p1PosY }

		const isIn: boolean = (
			(ball.x + ballDirection.x > rect.x && ball.x + ballDirection.x < rect.w) && (ball.y > rect.y && ball.y < rect.h)
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
			setBall({ x: ball.x + ballDirection.x, y: ball.y + ballDirection.y })
		}, 10)
		return () => clearInterval(interval);
	});

	const handleKeyUp = () => {
		if (props.config.p1PosY > 0)
			props.config.p1PosY -= 20;
	}
	const handleKeyDown = () => {
		if (props.config.p1PosY < props.config.canvasSize.y - props.config.paddleSize.y)
			props.config.p1PosY += 20;
	}

	const handleKeyUpP2 = () => {
		if (props.config.p2PosY > 0 && props.config.players === 2)
			props.config.p2PosY -= 20;
	}
	const handleKeyDownP2 = () => {
		if (props.config.p2PosY < props.config.canvasSize.y - props.config.paddleSize.y && props.config.players === 2)
			props.config.p2PosY += 20;
	}

	// ARROW UP
	useKeyDown(() => {
		handleKeyUp();
	}, ['ArrowUp'])

	// ARROW DOWN
	useKeyDown(() => {
		handleKeyDown();
	}, ['ArrowDown'])

	// PLAYER 2 UP
	useKeyDown(() => {
		handleKeyUpP2();
	}, ['w'])

	// PLAYER 2 DOWN
	useKeyDown(() => {
		handleKeyDownP2();
	}, ['s'])

	const resetGame = () => {
		setIsWinner("")
		ball.x = props.config.canvasSize.x / 2 - props.config.ballSize.x
		ball.y = (((width / 2) / 1.6) / 2) - (width * (8 / 100)) / 2
		props.config.scoreP1 = 0
		props.config.scoreP2 = 0
		props.config.p1PosY = (((width / 2) / 1.6) / 2) - (width * (8 / 100)) / 2
		props.config.p2PosY = (((width / 2) / 1.6) / 2) - (width * (8 / 100)) / 2
	}

	return  (
		<div>
			{!isWinner && <GameDisplay
			ball={ball}
			config={props.config}/>}
			{isWinner &&
			<div className="winner-page" style={{ width: props.config.canvasSize.x }}>
				<h1 className="winner-name">{isWinner} has won !</h1>
				<button className="reset-btn" onClick={resetGame}>Reset Game</button>
				<Confetti width={width} height={height}/>
			</div>}
		</div>
		)
}

export default GameEngine

/* 

TODO: 
	- fix ball stuck on paddle (=> check all ball area not just corner)
	- moving paddle with key
*/