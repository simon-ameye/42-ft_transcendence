import { NavLink } from 'react-router-dom'

const Navbar = () => {
	return (
		<header>
			<h3><i className="fa-solid fa-table-tennis-paddle-ball"></i>Pong Game</h3>
			<nav>
				<NavLink to="/">
					<i className="fas fa-home"></i>
					<span>Home</span>
				</NavLink>
				<NavLink to="/game">
					<i className="fa-solid fa-table-tennis-paddle-ball"></i>
					<span>Game</span>
				</NavLink>
				<NavLink to="/chat">
					<i className="fa-solid fa-comment"></i>
					<span>Chat</span>
				</NavLink>
				<NavLink to="/user">
					<i className="fa-solid fa-user"></i>
					<span>User</span>
				</NavLink>
				<NavLink to="/profile">
					<i className="fa-solid fa-user"></i>
					<span>Profile</span>
					{ /* do a button instead of a navlink*/}
				</NavLink>
				<NavLink to="/friends">
					<i className="fa-solid fa-user"></i>
					<span>Friends</span>
					{ /* do a button instead of a navlink*/}
				</NavLink>
			</nav>
		</header>
	);
};

export default Navbar;