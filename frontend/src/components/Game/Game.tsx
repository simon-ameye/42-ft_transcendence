import Ball from "./Ball";

const Game = () => {
	const ball = new Ball(document.getElementById("ball") as HTMLDivElement);

	let lastTime:number;
	function update(time:number){
		if (lastTime != null){
			const delta = time - lastTime;
			ball.update(delta);
		}
		lastTime = time;
		window.requestAnimationFrame(update);
	}
	window.requestAnimationFrame(update);

	return (
		<div className='gameBody'>
			<div className="score">
				<div id="player-score">0</div>
				<div id="computer-score">0</div>
			</div>
			<div className="ball" id="ball"></div>
			<div className="paddle left" id="player-paddle"></div>
			<div className="paddle right" id="computer-paddle"></div>
		</div>
	);
};

export default Game;