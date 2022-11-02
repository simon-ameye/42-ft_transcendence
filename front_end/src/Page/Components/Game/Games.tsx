import React, { useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import { Jeu } from "./game"
import "./Game.css";


export const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    var game = new Jeu(canvasRef.current as HTMLCanvasElement);
    game.gameLoop();

  })
  return (
    <div className="Game-container" >
      <Navbar />
      <canvas ref={canvasRef} height={400} width={700} id="game-canvas" ></canvas>
      <button> <span>Start game</span></button>
    </div >
  );
};

export default Game;