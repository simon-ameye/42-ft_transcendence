import { NavLink } from 'react-router-dom'
import Navbar from '../components/Navbar'

const NotFound = () => {
	return (
		<>
			<Navbar />
			<div className="notFound">
				<img src={require('../assets/pong_404.gif')} alt="404 pong gif"/>
				<NavLink className="navlink" to="/">
					<i className="fas fa-home"></i>
					<span>Acceuil</span>
				</NavLink>
			</div>
		</>
	);
};

export default NotFound;