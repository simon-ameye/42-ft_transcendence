import Default from "../../layouts/Default";
import { useMemo, useState } from "react";
import "./style.scss";
import { GameConfig } from "../interface/gameConfig";
import PlayerInterface from "../../interfaces/player.interface";
import GameDisplay from "../GameDisplay";
import useWindowSize from "react-use/lib/useWindowSize";

const Game = () => {
  // VARIABLES \\
  const { width, height } = useWindowSize();

  const [playerRight, setPlayerRight] = useState<PlayerInterface>({
    userId: 0,
    displayName: "right",
    score: 0,
    side: 0,
  });
  const [playerLeft, setPlayerLeft] = useState<PlayerInterface>({
    userId: 0,
    displayName: "left",
    score: 0,
    side: 0,
  });

  const gameConfig: GameConfig = useMemo(
    () => ({
      canvasSize: {
        x: width / 2,
        y: width / 2 / 1.6,
      },
      paddleOffset: width * (1 / 100),
      paddleSize: {
        x: width * (1.2 / 100),
        y: width * (8 / 100),
      },
      ballSize: {
        x: width * (1.2 / 100),
        y: width * (1.2 / 100),
      },
      bgColor: "#333",
      fgColor: "#fff",
      players2: [playerRight, playerLeft],
    }),
    [width, height]
  );

  return (
    <Default>
      <GameDisplay config={gameConfig} />
    </Default>
  );
};

export default Game;
