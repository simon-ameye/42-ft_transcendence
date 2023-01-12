import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { socket, handleTokenCorrupted } from "../../../App";
import './style.scss'

const Menu = (props: {displayName : string}) => {
  const navigate = useNavigate();


  const handleLogout = () => {
    axios
      .delete("http://localhost:3001/auth/logout")
      .then((res) => goToRegistration())
      .catch((err) => handleTokenCorrupted(err));
  };

  const goToRegistration = () => {
    socket.emit("reload");
    navigate("/");
  };

  return (
    <div className="brg-menu">
      <div className="nav-links-container">
        <NavLink to="/" className="nav-item">
          <i className="fas fa-home"></i>
          <span>Home</span>
        </NavLink>
        <NavLink to="/game" className="nav-item">
          <i className="fa-solid fa-table-tennis-paddle-ball"></i>
          <span>Game</span>
        </NavLink>
        <NavLink to="/ChatBox" className="nav-item">
          <i className="fa-solid fa-comment"></i>
          <span>Chat</span>
        </NavLink>
        <NavLink to="/friends" className="nav-item">
          <i className="fa-solid fa-user"></i>
          <span>Friends</span>
        </NavLink>
        <NavLink to="/Profile" className="nav-item">
          <i className="fa-solid fa-address-card"></i>
          <span>{props.displayName}</span>
        </NavLink>
        <button className='logout-btn' onClick={handleLogout}>
          <i className="fa-solid fa-arrow-right-from-bracket"/>
        </button>
      </div>
    </div>
  );
};

export default Menu;