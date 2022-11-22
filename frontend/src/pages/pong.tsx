import Game from '../components/Game/Game';
import Navbar from '../components/Navbar';

const pong = () => {
	return (
		<div className="gamePage">
			<Navbar />
			<Game />
		</div>
	);
};

export default pong;