import { useCookies } from 'react-cookie';
import { NavLink } from 'react-router-dom'
import { AiFillCaretDown, AiFillSetting } from 'react-icons/ai';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import './style.scss'
import { useState } from 'react';

const Navbar = () => {
  const [cookie] = useCookies(['displayName'])
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(!open)
  }

  return (
    <header>
      <div className='title'>
        <div className="fa-solid fa-table-tennis-paddle-ball">
          Pong Game
        </div>
      </div>
      <div className='nav'>
        <NavLink to="/" className='navItem'>
          <i className="fas fa-home"></i>
          <span>Home</span>
        </NavLink>
        <NavLink to="/game" className='navItem' >
          <i className="fa-solid fa-table-tennis-paddle-ball"></i>
          <span>Game</span>
        </NavLink>
        <NavLink to="/ChatBox" className='navItem' >
          <i className="fa-solid fa-comment"></i>
          <span>Chat</span>
        </NavLink>
        <NavLink to="/user" className='navItem' >
          <i className="fa-solid fa-user"></i>
          <span>User</span>
        </NavLink>
        <div className='navItem'>
          <div className='navList'>
            <div onClick={handleOpen}><i className="fa-solid fa-user"></i>{cookie.displayName}<AiFillCaretDown size={10}></AiFillCaretDown></div>
            {open ? (<ul>
              <li><NavLink to="/Profile"><CgProfile size={20}></CgProfile> <span>Profile</span></NavLink></li>
              <li><NavLink to="/UserSetting"><AiFillSetting size={20}></AiFillSetting> <span>Setting</span></NavLink></li>
              <li ><RiLogoutCircleRLine size={20}></RiLogoutCircleRLine> <span>Logout</span></li></ul>) : null}
          </div>
        </div>
      </div>
    </header >
  );
};

export default Navbar;