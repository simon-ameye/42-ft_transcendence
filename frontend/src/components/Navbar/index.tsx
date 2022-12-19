import { useCookies } from 'react-cookie';
import { socket } from '../../App';
import { NavLink } from 'react-router-dom'
import axios from 'axios';
import { AiFillCaretDown, AiFillSetting } from 'react-icons/ai';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import './style.scss'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [cookie] = useCookies(['displayName'])
  const [open, setOpen] = useState(false)
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(!open)
  }

  const handleLogout = () => {
    axios.delete('http://localhost:3001/auth/logout')
      .then(res => goToRegistration())
      .catch(err => console.log(err))
  }

  const goToRegistration = () => {
    socket.emit('reload');
    navigate('/');
  }

  return (
    <header>
      <div className='title'>
        <div className="fa-solid fa-table-tennis-paddle-ball">
          <span>Pong Game</span>
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
        <div className='navItem'>
          <div className='navList'>
            <div onClick={handleOpen}><i className="fa-solid fa-user" />{cookie.displayName}<AiFillCaretDown size={10} /></div>
            {open ? (<ul>
              <li className='navListItem'><NavLink to="/Profile"><CgProfile size={20}></CgProfile> <span>Profile</span></NavLink></li>
              <li className='navListItem'><NavLink to="/UserSetting"><AiFillSetting size={20}></AiFillSetting> <span>Setting</span></NavLink></li>
              <li className='navListItem'><button onClick={handleLogout}><RiLogoutCircleRLine size={20}></RiLogoutCircleRLine> <span>Logout</span></button></li></ul>) : null}
          </div>
        </div>
      </div>
    </header >
  );
};

export default Navbar;
