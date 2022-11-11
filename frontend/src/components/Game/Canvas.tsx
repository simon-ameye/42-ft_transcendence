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
