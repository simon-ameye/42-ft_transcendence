import { configure } from "@testing-library/react"
import { useEffect, useState } from "react"
import GameDisplay from "../GameDisplay"
import { useKeyDown } from "../hooks/useKeyDown"
import { GameConfig } from "../interface/gameConfig"
import PlayerInterface from '../../interfaces/player.interface'
import { socket } from '../../App'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const GameEngine = (props: { config: GameConfig }) => {

	const [cookie] = useCookies(['displayName']);
	const navigate = useNavigate();

	const playerRight: PlayerInterface = props.config.players2[0];
	const playerLeft: PlayerInterface = props.config.players2[1];

	const ballInitialX = props.config.canvasSize.x / 2 - props.config.ballSize.x
	const ballInitialY = props.config.canvasSize.y / 2 - props.config.ballSize.y

	const [ball, setBall] = useState({ x: ballInitialX, y: ballInitialY })
	const [ballDirection, setBallDirection] = useState({ x: 0, y: 0 })

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
		if (player === "P1") {
			props.config.scoreP1++;
			if (playerRight.displayName == cookie.displayName)
				socket.emit('add point', playerRight);
		}
		else {
			props.config.scoreP2++;
			if (playerLeft.displayName == cookie.displayName)
				socket.emit('add point', playerLeft);
		}
		//Reset ball position to center
//		setBall({ x: ball.x = ballInitialX, y: ball.y = Math.floor(Math.random() * (props.config.canvasSize.y - props.config.ballSize.x + ballDirection.x)) + 1 })
		setBall({ x: ball.x = ballInitialX, y: ball.y = ballInitialY });
		setBallDirection({ x: 0, y: 0});
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
		if (cookie.displayName == playerRight.displayName) {
			if (props.config.p1PosY > 0)
				props.config.p1PosY -= 20;
		}
		else if (cookie.displayName == playerLeft.displayName
				&& props.config.p2PosY > 0 && props.config.players == 2)
			props.config.p2PosY -= 20;
	}

	const handleKeyDown = () => {
		if (cookie.displayName == playerRight.displayName) {
			if (props.config.p1PosY < props.config.canvasSize.y - props.config.paddleSize.y)
				props.config.p1PosY += 20;
		}
		else if (cookie.displayName == playerLeft.displayName
					&& props.config.p2PosY < props.config.canvasSize.y - props.config.paddleSize.y
					&& props.config.players == 2)
			props.config.p2PosY += 20;
	}

	const handleKeyUpP2 = () => {
		if (cookie.displayName != playerRight.displayName) {
			if (props.config.p1PosY > 0)
				props.config.p1PosY -= 20;
		}
		else if (props.config.p2PosY > 0 && props.config.players == 2)
			props.config.p2PosY -= 20;
	}

	const handleKeyDownP2 = () => {
		if (cookie.displayName != playerRight.displayName) {
			if (props.config.p1PosY < props.config.canvasSize.y - props.config.paddleSize.y)
				props.config.p1PosY += 20;
		}
		else if (props.config.p2PosY < props.config.canvasSize.y - props.config.paddleSize.y && props.config.players == 2)
			props.config.p2PosY += 20;
	}

	// USE_EFFECT

	useEffect(() => {
		socket.on('kick-off', kickoffListener);
		return () => {
			socket.off('kick-off', kickoffListener);
		}
	});

	useEffect(() => {
		socket.on('join room', joinRoomListener);
		return () => {
			socket.off('join room', joinRoomListener);
		}
	});

	useEffect(() => {
		socket.on('game finished', gameFinishedListener);
		return () => {
			socket.off('game finished', gameFinishedListener);
		}
	});

	// ARROW UP
	useKeyDown(() => {
		handleKeyUp();
		if (playerLeft.displayName == cookie.displayName)
			socket.emit('arrow up', playerRight.displayName);
		else if (playerRight.displayName == cookie.displayName)
			socket.emit('arrow up', playerLeft.displayName);
	}, ['ArrowUp'])

	// ARROW DOWN
	useKeyDown(() => {
		handleKeyDown();
		if (playerLeft.displayName == cookie.displayName)
			socket.emit('arrow down', playerRight.displayName);
		else if (playerRight.displayName == cookie.displayName)
			socket.emit('arrow down', playerLeft.displayName);
	}, ['ArrowDown'])

	// PLAYER 2 UP
	useEffect(() => {
		socket.on('arrow up', handleKeyUpP2);
		return () => {
			socket.off('arrow up', handleKeyUpP2);
		}
	});

	// PLAYER 2 DOWN
	useEffect(() => {
		socket.on('arrow down', handleKeyDownP2);
		return () => {
			socket.off('arrow down', handleKeyDownP2);
		}
	});

	// LISTENER

	const kickoffListener = () => {
		setBallDirection({ x: 3, y: 3 })
	}

	const	joinRoomListener = (gameRoom: string) => {
		socket.emit('join room', gameRoom);
	}

	const gameFinishedListener = () => {
		navigate('/game');
	}

	return <GameDisplay
		ball={ball}
		config={props.config}
	/>
}

export default GameEngine

/* 

TODO: 
	- fix ball stuck on paddle (=> check all ball area not just corner)
	- moving paddle with key
*/
