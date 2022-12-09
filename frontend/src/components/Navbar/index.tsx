import { useCookies } from 'react-cookie';
import { NavLink } from 'react-router-dom'
import { AiFillSetting } from 'react-icons/ai';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import { HiBars4 } from "react-icons/hi2";
import './style.scss'
import { useState } from 'react';
import { Button } from '@mui/material';

const Navbar = () => {
	const [cookie] = useCookies(['displayName'])
	const [open, setOpen] = useState(false)
	const handleOpen = () => {
		setOpen(!open)
	}

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
				<NavLink to="/ChatBox">
					<i className="fa-solid fa-comment"></i>
					<span>Chat</span>
				</NavLink>
				<NavLink to="/user">
					<i className="fa-solid fa-user"></i>
					<span>User</span>
				</NavLink>
				<NavLink to="/gameTest">
					<i className=""></i>
					<span>GameTest</span>
				</NavLink>
				{cookie.displayName}
				<Button  onClick={handleOpen}><HiBars4 size={20}></HiBars4></Button>
				{open ? (<ul className="DropDown">
				<div className='DropDown_content'>
					<li><NavLink to="/UserProfile"><CgProfile size={20}></CgProfile> <span>Profile</span></NavLink></li>
					<li><NavLink to="/UserSetting"><AiFillSetting size={20}></AiFillSetting> <span>Setting</span></NavLink></li>
						<li ><button><RiLogoutCircleRLine size={20}></RiLogoutCircleRLine> <span>Logout</span></button></li></div></ul>) : null}
			</nav>
		</header>
	);
};

export default Navbar;