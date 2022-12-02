import { NavLink } from 'react-router-dom'
import Default from '../../layouts/Default'
import './style.scss'

const NotFound = () => {
	return (
		<Default>
			<div className="notFound">
				<img src={require('../../assets/pong_404.gif')} alt="404 pong gif"/>
				<NavLink className="navlink" to="/">
					<i className="fas fa-home"></i>
					<span>Acceuil</span>
				</NavLink>
			</div>
		</Default>
	);
};

export default NotFound;