import { useEffect, useState } from "react";
import Default from "../../layouts/Default";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

const Winner = () => {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const gi = useLocation();
  const [redirect, setRedirect] = useState(false);
  const [winner, setWinner] = useState("");

  const displayWinnerName = () => {
    if (gi.state.gi.p1score === 10) {
      setWinner(gi.state.gi.p1Name);
    } else if (gi.state.gi.p2score === 10) {
      setWinner(gi.state.gi.p2Name);
    }
  };

  useEffect(() => {
    if (!gi.state) {
      navigate("/game");
      return;
    }
    displayWinnerName();
    const interval = setInterval(() => {
      setRedirect(true);
    }, 7000);
    return () => clearInterval(interval);
  });

  if (redirect) navigate("/game");

  return (
    <Default>
      <Confetti width={width} height={height} />
      <h1 className="winnerDiv">{winner} as won the game</h1>
    </Default>
  );
};

export default Winner;
