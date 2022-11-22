<<<<<<< HEAD
import { useEffect, useRef, useState } from "react";

interface props {
	width:number;
	height:number;
}

const Canvas: React.FC<props> = ({width, height}) => {

	const [paddlePosY, setPaddlePosY] = useState(0);
	const leftPaddle = {posX: 10, posY: (height / 2) - 50, elemHeight: 100, elemWidth: 10};
	const rightPaddle = {posX: width - 20, posY: (height / 2) - 50, elemHeight: 100, elemWidth: 10};


	
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	let context:CanvasRenderingContext2D | null;
	
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) 
		throw new Error("Error")
		context = canvas.getContext("2d");
		if (!context)
		throw new Error("Error")
		draw(context);
		
	}, []);
	const handleKeyPress = (event:React.KeyboardEvent<HTMLElement>) => {
		if (event.key == "ArrowUp")
		{
			setPaddlePosY(paddlePosY + 100);
			console.log(paddlePosY);
			draw(context);
			
		}
		//else if (event.key == "ArrowDown")
		//{
			
		//}
	}
	
	function draw(context:CanvasRenderingContext2D | null) {
		if (context)
		{
			context.fillStyle = "#333";
			context.fillRect(0, 0, width, height);
			context.fillStyle = "#fff"
			context.fillRect(leftPaddle.posX, leftPaddle.posY + paddlePosY, leftPaddle.elemWidth, leftPaddle.elemHeight);
			context.fillRect(rightPaddle.posX, rightPaddle.posY, rightPaddle.elemWidth, rightPaddle.elemHeight);
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
=======
//import Paddle from "./Paddle";
import React, { useRef, useEffect } from 'react';

interface props {
	y:number
	width:number
	height:number
}

const Canvas: React.FC<props> = ({y, width, height}) => {
  let canvasRef = useRef<HTMLCanvasElement | null>(null);
  let canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
		canvasCtxRef.current = canvasRef.current.getContext('2d');
		let ctx = canvasCtxRef.current;
		ctx!.fillStyle = "#ffffff";
		ctx!.fillRect(5, y, width, height);
    }
});

const  handleKeyDown = () => {
			console.log("OUI")
	};

  return (
	<div>
		<div className="score"></div>
  		<canvas onKeyDown={handleKeyDown} ref={canvasRef}></canvas>
	</div>
  );
};

export default Canvas;
>>>>>>> main
