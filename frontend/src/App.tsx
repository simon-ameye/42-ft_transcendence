import { useEffect } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import User from "./components/User";
import Game from "./components/GameSetup";
import io from "socket.io-client";
import AuthPassed from "./components/Auth/authPassed";
import Auth2FA from "./components/Auth/auth2fa";
import axios, { AxiosError } from "axios";
import Winner from "./components/WinnerPage";
import ChatBox from "./components/Chat/ChatBox";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import { useCookies } from "react-cookie";
import InvitPopup from "./components/Matchmaking/invit-popup.component";
import UnavailableInterface from "./interfaces/unavailable.interface";
import Friends from "./components/Friends";
import PublicProfile from './components/Profile/public';

axios.defaults.withCredentials = true;

export let socket = io("http://localhost:4343", { withCredentials: true });

function App() {
  // ON INIT \\

  socket.emit("hello");

	const [cookie] = useCookies(['login']);
	const navigate = useNavigate();

  useEffect(() => {
    socket.on("heyo", heyoListener);
    return () => {
      socket.off("heyo", heyoListener);
    };
  });

  useEffect(() => {
    socket.on("reload", reloadListener);
    return () => {
      socket.off("reload", reloadListener);
    };
  });

  useEffect(() => {
    socket.on("cannot invit", cannotInvitListener);
    return () => {
      socket.off("cannot invit", cannotInvitListener);
    };
  });

	useEffect(() => {
		socket.on("start game", startGameListener);
		return () => {
			socket.off("start game", startGameListener);
		}
	});

  // LISTENER \\

  const heyoListener = () => {
    if (cookie.login) {
      axios
        .put("http://localhost:3001/user/modifySocketId", {
          socketId: socket.id,
        })
        .then((res) => socket.emit("is playing"))
        .catch((err) => handleTokenCorrupted(err));
    }
  };

	const startGameListener = () => {
		navigate('/game');
	}

  const reloadListener = () => {
    window.location.reload();
  };

  const cannotInvitListener = (unavailable: UnavailableInterface) => {
    if (unavailable.why === 1) {
      alert(unavailable.name + " is not log in");
    } else if (unavailable.why === 2) {
      alert(unavailable.name + " is already in a game");
    } else if (unavailable.why === 3) {
      alert(unavailable.name + " is in the matching queue");
    }
  };

  // FUNCTIONS \\

  const handleTokenCorrupted = (err: AxiosError) => {
    if (err.response && err.response.status === 403) alert("Cookies corrupted");
  };

  return cookie.login ? (
		<>
  	  <Routes>
  	    <Route path="/auth" element={<AuthPassed />} />
  	    <Route path="/" element={<Home />} />
  	    <Route path="/ChatBox" element={<ChatBox />} />
				<Route path="/game" element={<Game />} />
        <Route path="/game/winner" element={<Winner />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/publicProfile/:id" element={<PublicProfile/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <InvitPopup />
    </>
  ) : (
		<Routes>
			<Route path="/" element={<User />} />
      <Route path="/auth" element={<AuthPassed />} />
	    <Route path="*" element={<NotFound />} />
			<Route path="/auth2fa" element={<Auth2FA />} />
		</Routes>
	);
}

export default App;
