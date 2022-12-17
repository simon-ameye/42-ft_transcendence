import Default from '../../layouts/Default';
import { useMemo, useState, useEffect } from 'react';
import './style.scss'
import { GameConfig } from '../interface/gameConfig';
import { socket } from '../../App';
import PlayerInterface from '../../interfaces/player.interface';
import { useCookies } from 'react-cookie';
import GameDisplay from '../GameDisplay';
import useWindowSize from 'react-use/lib/useWindowSize'

const Game = () => {

  // VARIABLES \\
  const { width, height } = useWindowSize()

  //const [cookie] = useCookies(['displayName']);
  //const [rerender, setRerender] = useState<boolean>(false);
  const [playerRight, setPlayerRight] =
    useState<PlayerInterface>({ userId: 0, displayName: "right", score: 0, side: 0 });
  const [playerLeft, setPlayerLeft] =
    useState<PlayerInterface>({ userId: 0, displayName: "left", score: 0, side: 0 });
  //const [spectator, setSpectator] = useState<boolean>(false);
  //const [playing, setPlaying] = useState<boolean>(false);

  // USE_EFFECT \\

  //useEffect(() => {
  //  socket.on('game started', gameStartedListener);
  //  return () => {
  //    socket.off('game started', gameStartedListener);
  //  }
  //});

  //useEffect(() => {
  //  socket.on('is playing', isPlayingListener);
  //  return () => {
  //    socket.off('is playing', isPlayingListener);
  //  }
  //});

  // LISTENER \\

  //const gameStartedListener = (players: PlayerInterface[]) => {
  //  var r = 1;
  //  var l = 0;
  //  if (players[1].side) {
  //    r = 0;
  //    l = 1;
  //  }
  //  playerRight.displayName = players[r].displayName;
  //  playerLeft.displayName = players[l].displayName;
  //  playerRight.userId = players[r].userId;
  //  playerLeft.userId = players[l].userId;
  //  playerRight.score = players[r].score;
  //  playerLeft.score = players[l].score;
  //  setPlayerRight(playerRight);
  //  setPlayerLeft(playerLeft);
  //  setRerender(!rerender);
  //  setPlaying(true);
  //}

  //const isPlayingListener = (playing: boolean) => {
  //  setPlaying(playing);
  //  console.log({ playing: playing });
  //  if (playing)
  //    socket.emit('get players');
  //}

  const gameConfig: GameConfig = useMemo(() => ({
    canvasSize: {
      x: width / 2,
      y: (width / 2) / 1.6,
    },
    paddleOffset: width * (1 / 100),
    paddleSize: {
      x: width * (1.2 / 100),
      y: width * (8 / 100),
    },
    ballSize: {
      x: width * (1.2 / 100),
      y: width * (1.2 / 100)
    },
    bgColor: "#333",
    fgColor: '#fff',
    players2: [playerRight, playerLeft],
  }), [width, height])

  return (
    <Default>
      <GameDisplay
        config={gameConfig}
      />
    </Default>
  );
};

export default Game;
