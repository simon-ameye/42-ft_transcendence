import Navbar from '../components/Navbar';
import { useCookies } from 'react-cookie';

const Home = () => {

	const [cookie] = useCookies(['displayName']);

	return (
		<>
			<Navbar />
			<div className='homeContent'>
				<h3>Pong Game - ft_transcendence</h3>
				<p className='pongHistory'>
					Pong is a table tennis–themed twitch arcade sports video game, featuring simple two-dimensional graphics, manufactured by Atari and originally released in <span>1972</span>. It was one of the earliest arcade video games; it was created by <span>Allan Alcorn</span> as a training exercise assigned to him by Atari co-founder Nolan Bushnell, but Bushnell and Atari co-founder Ted Dabney were surprised by the quality of Alcorn's work and decided to manufacture the game.
				</p>
			</div>
			<div>
				<h1> Hello {cookie.displayName}!</h1>
			</div>
		</>
	);
};

export default Home;
