import { useEffect, useRef } from "react";

interface props {
	width:number;
	height:number;
}

interface elementSize {
	elemWidth:number;
	elemHeight:number;
}

interface paddle extends elementSize {
	posX:number;
	posY:number;
}

const Canvas: React.FC<props> = ({width, height}) => {

	const canvasWidth = width;
	const canvasHeight = height;
	const leftPaddle = initPaddle({posX: 10, posY: (canvasHeight / 2) - 50, elemHeight: 100, elemWidth: 10});
	const rightPaddle = initPaddle({posX: canvasWidth - 20, posY: (canvasHeight / 2) - 50, elemHeight: 100, elemWidth: 10});
	let move = 0;


	function initPaddle (leftPaddle: paddle){
		return (leftPaddle);
	}

	const handleKeyPress = (event:React.KeyboardEvent<HTMLElement>) => {
		if (event.key == "ArrowUp")
		{
			move++;
		}
		else if (event.key == "ArrowDown")
		{

		}
	}

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	let context:CanvasRenderingContext2D | null;

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) 
			throw new Error("Error")
		context = canvas.getContext("2d");
		if (!context)
			throw new Error("Error")
		draw(context, move);

	}, []);
	
	function draw(context:CanvasRenderingContext2D | null, move:number) {
		if (context)
		{
			context.fillStyle = "#333";
			context.fillRect(0, 0, canvasWidth, canvasHeight);
			context.fillStyle = "#fff"
			context.fillRect(leftPaddle.posX, leftPaddle.posY + move, leftPaddle.elemWidth, leftPaddle.elemHeight);
			context.fillRect(rightPaddle.posX, rightPaddle.posY + move, rightPaddle.elemWidth, rightPaddle.elemHeight);
		}
	}

	function clearCanvas(context:CanvasRenderingContext2D | null){
		if (context)
		{
			context.fillStyle = "#333";
			context.fillRect(0, 0, canvasWidth, canvasHeight);
		}
	}
	return (
		<canvas 
			tabIndex={0}
			width={width}
			height={height}
			ref={canvasRef}
			onKeyDown={handleKeyPress}
		/>
	);
};

export default Canvas;