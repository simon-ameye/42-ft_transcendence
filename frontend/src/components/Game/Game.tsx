<<<<<<< HEAD
import Ball from "./Ball"
import Canvas from "./Canvas"
import Paddle from "./Paddle"

//const PLAYER_UP   = 38  // up arrow
//const PLAYER_DOWN = 40  // down arrow

const Game = () => 
{
	return (
		<div className="playgroundArea">
			<Canvas width={1000} height={500}/>
=======
import Canvas from "./Canvas"

const Game: React.FC = () => 
{
	return (
		<div className="playgroundArea">
			<Canvas y={1} width={5} height={25}/>
>>>>>>> main
		</div>
	)
}

<<<<<<< HEAD
export default Game
=======
export default Game
>>>>>>> main
