import Navbar from '../Navbar';
import { ReactNode, useEffect, useState } from "react";
import axios from 'axios';
import ProfileInterface from './Interface/ProfileInterface';
import './style.scss'
import FileUpload from './upload';
import User from '../User';
import { ListItem } from '@mui/material';
import Default from '../../layouts/Default';
import { profile } from 'console';

type User = {
  email: string;
  displayName: string;
  imageUrl: string;
  id: number;
  socketId: string;
  matchHistory: string[];
}

const Profile = () => {
  const [profileInterface, setprofileInterface] = useState<ProfileInterface | undefined>()
  const [friends, setFriends] = useState<User[]>([])

  const friendList = friends.map((c, i) => (
    // add a link to each friend profile
    <ListItem key={i}>
      {c.displayName}
    </ListItem >
  ))
  
  const matchHistory = profileInterface?.matchHistory.map((c, i) => (
    // add a link to each friend profile
    <ListItem key={i}>
      { profileInterface?.displayName } VS { c.opponent } Score: {c.score[0]} {c.score[1]} on { c.date }
    </ListItem>
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
      <div className='profile'>
        <div className='imageDiv'>
          <img className='profileImage' src="http://localhost:3001/profile/getImage" alt='profileImage'
          width="300" height="300"
          ></img>
        </div>
        <div className='displayName'>{profileInterface?.displayName}</div>
        <FileUpload/>
        <div className='friendList'>
          <h3>friends</h3>
          {friendList}
        </div>
        <div>level: {profileInterface?.victories} </div>
        <div className='matchHistoryTable'>
          { matchHistory }
        </div>
      </div>
    </Default>
  )
}

export default Profile;