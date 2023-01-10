import { ReactNode, useEffect, useState } from "react";
import axios from 'axios';
import ProfileInterface from './Interface/ProfileInterface';
import './style.scss'
import FileUpload from './upload';
import User from '../User';
import { ListItem } from '@mui/material';
import Default from '../../layouts/Default';

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

  const friendList = friends.map((c, i) => (
    // add a link to each friend profile
    <ListItem key={i}>
      <li title={c.status == "OFFLINE" ? "Offline" : "Online"}>
        {c.status == "OFFLINE" ? <div className='offline'></div> : <div className='online'></div>} {c.displayName}
        <span className="playing">{c.status == "PLAYING" ? c.status : ""}</span>
      </li>
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

  useEffect(() => {
    axios.get('http://localhost:3001/profile/myProfile', {
    }).then(
      function (response) {
        setprofileInterface(response.data);
      }).catch(err => console.log(err));
  }, [])

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
          {profileInterface?.displayName}
        </div>
        <span className='changepp'>Change profile picture :
          <FileUpload />
        </span>
        <div className="social-info">Social & Stats
          <div className="info-container">
            <div className='friend'>
              <span className='friend-title'>Friends :</span>
              <div className="friendlist">{friendList}</div>
            </div>
            <div className="victories">
              <span className='vict-title'>My victories:</span>
              <span>{profileInterface?.victories}</span>
            </div>
            <div className="match-history">
              <span className='hist-title'>Match History</span>
              <span>{matchHistory}</span>
            </div>
          </div>
        </div>
      </div>
    </Default >
  )
}

export default Profile;
