import { useCookies } from "react-cookie";
import { socket, handleTokenCorrupted } from "../../App";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./style.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu";
import useWindowSize from "react-use/lib/useWindowSize";

const Navbar = () => {
  const { width } = useWindowSize();
  const [cookie] = useCookies(["displayName"]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(!open);
  };

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

  useEffect(() => {
    if (width > 700)
      setOpen(false);
  }, [width]);

  return (
      <>
        <nav className='navbar'>
          <div className="title">
            <i className="fa-solid fa-table-tennis-paddle-ball"/>
            <span className="pong">Pong Game</span>
          </div>
          <div className="nav-links">
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
              <span>{cookie.displayName}</span>
            </NavLink>
            <button className='logout-btn' onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"/>
              <span>Logout</span>
            </button>
          </div>
          <div className="menu" onClick={handleOpen}>
            <i className="fa-solid fa-bars"></i>
          </div>
        </nav>
        {open ? <Menu displayName={cookie.displayName}/> : null}
      </>
    );
  };
  
  export default Navbar;
