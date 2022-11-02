import React from 'react';
import { NavLink } from 'react-router-dom'

const NotFound = () => {
	return (
		<div className="notFound">
			<div className="notFoundContent">
				<h3>404 page</h3>
				<NavLink exact to="/" activeClassname="navActive">
					<i className="fas fa-home"></i>
					<span>Acceuil</span>
				</NavLink>
			</div>
		</div>
	);
};

export default NotFound;