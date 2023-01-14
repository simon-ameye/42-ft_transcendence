import { useEffect, useState } from "react";
import axios from 'axios';
import ProfileInterface from './Interface/ProfileInterface';
import './style.scss'
import { ListItem } from '@mui/material';
import Default from '../../layouts/Default';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

type User = {
  email: string;
  displayName: string;
  imageUrl: string;
  id: number;
  socketId: string;
}

const PublicProfile = () => {
  const [profileInterface, setprofileInterface] = useState<ProfileInterface | undefined>()
  const [friends, setFriends] = useState<User[]>([])
  let { id } = useParams()
  const navigate = useNavigate();

  const friendList = friends.map((c, i) => (
    <ListItem key={i}>
      <ul className="vist-profile" onClick={(e) => navigate("/publicProfile/" + c.id)} >
        {c.displayName}
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

  useEffect(() => {
    axios.get('http://localhost:3001/profile/findbyId/:id', { params: { id: id } }
    ).then(
      function (response) {
        setprofileInterface(response.data);
      }).catch(err => console.log(err));
  }, [id])

  const renderImg = () => {
    let path = "http://localhost:3001/profile/getImageById/:id?id=" + id;
    return (
      <img className='profileImage' src={path} alt='profileImage'
        width="300" height="300"></img>
    )
  }

  useEffect(() => {
    axios.get('http://localhost:3001/user/friendslistById/:id', { params: { id: id } })
      .then(res => {
        setFriends(res.data);
      })
      .catch(err => {
        console.log(err)
      })
  }, [id]);

  return (
    <Default>
      <div className='profile-container'>
        <div className="name-picture">
          {renderImg()}
          {profileInterface?.displayName}
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
    </Default>
  )
}

export default PublicProfile;
