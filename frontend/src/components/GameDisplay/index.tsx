import { useCallback, useEffect, useRef, useState } from "react";
import { GameConfig } from "../interface/gameConfig";
import "./style.scss";
import { GameInterface } from "./interfaces/game.interface";
import { socket } from "../../App";
import { useKeyDown } from "../hooks/useKeyDown";
import { useNavigate } from "react-router-dom";
import { XY } from "../interface/position";
import Matchmaking from "../Matchmaking";

const GameDisplay = (props: { config: GameConfig }) => {
  const [backColor, setBackColor] = useState("#333333");
  const [compColor, setCompColor] = useState("#ffffff");

  const [gi, setgi] = useState<GameInterface | undefined>();

  const navigate = useNavigate();

  const canvas = useRef<HTMLCanvasElement>(null);

  const { canvasSize, ballSize, bgColor, fgColor, paddleOffset, paddleSize } =
    props.config;

  const drawRect = (
    context: CanvasRenderingContext2D,
    pos: XY,
    size: XY,
    color: string
  ) => {
    context.fillStyle = color;
    if (pos.x === undefined || pos.y === undefined) return;
    if (size.x === undefined || size.y === undefined) return;
    context.fillRect(
      canvasSize.x * (pos.x - size.x / 2),
      canvasSize.y * (pos.y - size.y / 2),
      canvasSize.x * size.x,
      canvasSize.y * size.y
    );
  };

  const drawAll = useCallback(
    (context: CanvasRenderingContext2D) => {
      if (gi === undefined) return;
      // Background
      drawRect(context, { x: 0.5, y: 0.5 }, { x: 1, y: 1 }, bgColor);

      // Line
      drawRect(context, { x: 0.5, y: 0.5 }, { x: 0.001, y: 0.9 }, fgColor);

      // P1
      drawRect(
        context,
        { x: gi.paddleOffcet - gi.paddleThickness / 2, y: gi.p1Y },
        { x: gi.paddleThickness, y: gi.paddleHeight },
        fgColor
      );

      // P2
      drawRect(
        context,
        { x: 1 - gi.paddleOffcet + gi.paddleThickness / 2, y: gi.p2Y },
        { x: gi.paddleThickness, y: gi.paddleHeight },
        fgColor
      );

      // Ball
      drawRect(
        context,
        { x: gi.ballX, y: gi.ballY },
        { x: gi.ballRadius, y: gi.ballRadius },
        fgColor
      );
    },
    [gi, canvasSize, ballSize, bgColor, fgColor, paddleOffset, paddleSize]
  );

  useEffect(() => {
    const canvasCurrentRef = canvas.current;
    if (!canvasCurrentRef) return;

    const context = canvasCurrentRef.getContext("2d");
    if (!context) return;

    drawAll(context);
  }, [gi, canvas, drawAll]);

  props.config.bgColor = backColor;
  props.config.fgColor = compColor;

  const handleGameInterface = (gi: GameInterface) => {
    setgi(gi);
  };

  useEffect(() => {
    socket.on("gameInterface", handleGameInterface);
    return () => {
      socket.off("gameInterface", handleGameInterface);
    };
  });

  useEffect(() => {
    socket.on("join room", joinRoomListener);
    return () => {
      socket.off("join room", joinRoomListener);
    };
  });

  useEffect(() => {
    socket.on("game finished", gameFinishedListener);
    return () => {
      socket.off("game finished", gameFinishedListener);
    };
  });

  useKeyDown(() => {
    socket.emit("arrow up");
    console.log("presssss");
  }, ["ArrowUp"]);

  useKeyDown(() => {
    socket.emit("arrow down");
  }, ["ArrowDown"]);

  const powerUp = () => {
    console.log("Powering up !");
    socket.emit("powerUp");
  };

  const joinRoomListener = (gameRoom: string) => {
    socket.emit("join room", gameRoom);
  };

  const gameFinishedListener = () => {
    navigate("/game/winner", {
      state: {
        gi: gi,
      },
    });
    setgi(undefined);
  };

  return gi ? (
    <div className="game-container">
      <div className="scoreboard" style={{ width: canvasSize.x }}>
        <div className="p1-scoreboard">
          <h5 className="name-1">{gi?.p1Name}</h5>
          <h2 className="score-1">{gi?.p1score}</h2>
        </div>
        <div className="p2-scoreboard">
          {gi?.powerUp ? "Power up enabled !!" : ""}
        </div>
        <div className="p2-scoreboard">
          <h5 className="name-2">{gi?.p2Name}</h5>
          <h2 className="score-2">{gi?.p2score}</h2>
        </div>
      </div>
      <canvas width={canvasSize.x} height={canvasSize.y} ref={canvas} />
      <div className="color" style={{ width: canvasSize.x }}>
        <div className="background-color">
          <label>background color :</label>
          <input
            type="color"
            value={backColor}
            onChange={(e) => setBackColor(e.target.value)}
          />
        </div>
        <button onClick={powerUp}>Power UP !</button>
        <div className="pad-ball-color">
          <label>pad/ball color :</label>
          <input
            type="color"
            value={compColor}
            onChange={(e) => setCompColor(e.target.value)}
          />
        </div>
      </div>
    </div>
  ) : (
    <Matchmaking />
  );
};

export default GameDisplay;
