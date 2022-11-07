import React from 'react';
import { NavLink } from 'react-router-dom'
import Navbar from '../components/Navbar';

const NotFound = () => {
	return (
		<div className="notFound">
			<Navbar />
			<div className="notFoundContent">
				<h3>404 page</h3>
				<NavLink to="/">
					<i className="fas fa-home"></i>
					<span>Acceuil</span>
				</NavLink>
			</div>
		</div>
	);
};

export default NotFound;