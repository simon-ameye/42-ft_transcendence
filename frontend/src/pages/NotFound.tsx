import { NavLink } from 'react-router-dom'
import AuthenticatedLayout from '../layouts/Authenticated'

const NotFound = () => {
	return (
		<AuthenticatedLayout>
			<div className="notFound">
				<img src={require('../assets/pong_404.gif')} alt="404 pong gif"/>
				<NavLink className="navlink" to="/">
					<i className="fas fa-home"></i>
					<span>Acceuil</span>
				</NavLink>
			</div>
		</AuthenticatedLayout>
	);
};

export default NotFound;