import React from 'react'
import "./Navbar.css";
import Home from '../../Home';
import { NavLink } from 'react-router-dom';
import Game from '../Game/Games';


export const Navbar: React.FC = () => {
    return (

        <nav className="Navbar">
            <h1><span style={{ color: " rgb(7, 86, 50)" }}>Pong</span>ame</h1>
            <NavLink className="item" to="/">
                <li className="items">Home
                </li>
            </NavLink>
            <NavLink className="item" to="/Game">
                <li className="items" >Game</li>
            </NavLink>
            <NavLink className="item" to="/RegisterPage">
                <li className="items" >Users</li>
            </NavLink>
        </nav>
    )
}

export default Navbar;
