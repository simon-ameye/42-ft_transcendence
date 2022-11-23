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
		</div>
	)
}

export default Game
