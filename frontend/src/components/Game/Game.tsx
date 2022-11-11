import Canvas from "./Canvas"

const Game: React.FC = () => 
{
	return (
		<div className="playgroundArea">
			<Canvas y={1} width={5} height={25}/>
		</div>
	)
}

export default Game