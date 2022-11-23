import Navbar from '../components/Navbar';
//import Game from '../components/Game/Game';
import Game from '../components/AbrunGame/Game';

const gamePage = () => {
	return (
		<>
			<Navbar />
			<div>
				<Game />
			</div>
		</>
	);
};

export default gamePage;
