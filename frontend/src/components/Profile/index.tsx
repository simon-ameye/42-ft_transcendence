import { useEffect, useState } from "react";
import axios from 'axios';
import ProfileInterface from './Interface/ProfileInterface';
import './style.scss'
import FileUpload from './upload';
import { ListItem } from '@mui/material';
import Default from '../../layouts/Default';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

type User = {
  email: string;
  displayName: string;
  imageUrl: string;
  id: number;
  socketId: string;
  status: string;
  matchHistory: string[];
}

const Profile = () => {
  const [profileInterface, setprofileInterface] = useState<ProfileInterface | undefined>()
  const [friends, setFriends] = useState<User[]>([])
  const [cookie] = useCookies(['qrcode', 'displayName']);
  const [dfa, setDfa] = useState<string>('');
  const [displayqrcode, setDisplayqrcode] = useState<boolean>(false);
  const [displayqrcodeMessage, setDisplayqrcodeMessage] = useState<string>("Display QR Code");
  const navigate = useNavigate();

  const friendList = friends.map((c, i) => (
    // add a link to each friend profile
    <ListItem key={i}>
      <ul className="vist-profile" onClick={(e) => navigate("/publicProfile/" + c.id)} title={c.status === "OFFLINE" ? "Offline" : "Online"}>
        {c.status === "OFFLINE" ? <div className='offline'></div> : <div className='online'></div>} {c.displayName}
        <span className="playing">{c.status === "PLAYING" ? c.status : ""}</span>
      </ul>
    </ListItem >
  ))

  const matchHistory = profileInterface?.matchHistory.reverse().map((c, i) => (
    <ListItem key={i}>
      <div className="history">
        <div className="versus">
          <span className='P1'>
            {profileInterface?.displayName}
            <span className='score'>
              {c.score[0]}
            </span>
          </span>
          <span>
            <i id='lightning' className='fa-solid fa-bolt' />
          </span>
          <span className='P2'>
            {c.opponent}
            <span className='score'>
              {c.score[1]}
            </span>
          </span>
        </div>
        <span className='separator'>-</span>
        <div className="date">
          <span className='date'>
            {c.date}
          </span>
        </div>
      </div>
    </ListItem >
  ))

  const activate2fa = () => {
    axios.post('http://localhost:3001/auth/google2FA/activate')
      .then(res => window.location.reload())
      .catch(err => console.log(err))
  }

  const desactivate2fa = () => {
    axios.post('http://localhost:3001/auth/google2FA/desactivate')
      .then(res => window.location.reload())
      .catch(err => console.log(err))
  }

  const displayQrcode = () => {
    setDisplayqrcode(!displayqrcode);
    if (!displayqrcode)
      setDisplayqrcodeMessage("Hide QR Code");
    else
      setDisplayqrcodeMessage("Display QR Code");
  }

  useEffect(() => {
    axios.get('http://localhost:3001/profile/myProfile', {
    }).then(
      function (response) {
        setprofileInterface(response.data);
      }).catch(err => console.log(err));
  }, [])

  useEffect(() => {
    if (cookie.displayName) {
      axios.get('http://localhost:3001/user/get2fa', {
        params: {
          displayName: cookie.displayName,
        }
      })
        .then(res => setDfa(res.data))
        .catch(err => console.log(err))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3001/user/friendsList')
      .then(res => {
        setFriends(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  return (
    <Default>
      <div className='profile-container'>
        <div className="name-picture">
          <img className='profileImage' src="http://localhost:3001/profile/getImage" alt='profileImage'
            width="300" height="300"
          ></img>
          <div className="name">
            {profileInterface?.displayName}
          </div>
        </div>
        <span className='changepp'>Change profile picture :
          <FileUpload />
        </span>
        <div className="g-auth">
          {dfa === 'no' &&
            <button
              onClick={activate2fa} className='submit-btn'>Enable 2FA</button>}
          {dfa === 'yes' &&
            <button
              onClick={desactivate2fa} className='submit-btn'>Disable 2FA</button>}
        </div>
        <div>
          {cookie.qrcode &&
            <button onClick={displayQrcode} className='submit-btn'>{displayqrcodeMessage}</button>}
          {displayqrcode && <img src={cookie.qrcode} alt="qrcode" style={{ width: '400px' }}></img>}
        </div>
        <div className="social-info">Social & Stats
          <div className="info-container">
            <div className='friend'>
              <span className='friend-title'>Friends:</span>
              <div className="friendlist">{friendList}</div>
            </div>
            <div className="victories">
              <span className='vict-title'>Victories:</span>
              <div className="vict">{profileInterface?.victories}</div>
            </div>
            <div className="match-history">
              <span className='hist-title'>Match History</span>
              <span className="hist">{matchHistory}</span>
            </div>
          </div>
        </div>
      </div>
    </Default >
  )
}

export default Profile;
