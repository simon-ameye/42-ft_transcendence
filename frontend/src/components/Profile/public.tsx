import Navbar from '../Navbar';
import { ReactNode, useEffect, useState } from "react";
import axios from 'axios';
import ProfileInterface from './Interface/ProfileInterface';
import './style.scss'
import FileUpload from './upload';
import User from '../User';
import { ListItem } from '@mui/material';
import Default from '../../layouts/Default';
import { useParams } from 'react-router-dom';
import { findRenderedDOMComponentWithTag } from 'react-dom/test-utils';

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

  const friendList = friends.map((c, i) => (
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
    axios.get('http://localhost:3001/profile/findbyId/:id', {params:{ id: id }}
    ).then(
      function (response) {
        setprofileInterface(response.data);
      }).catch(err => console.log(err));
  }, [])

  const renderImg = () => {
    let path = "http://localhost:3001/profile/getImageById/:id?id=" + id;
    return (
      <img className='profileImage' src={path} alt='profileImage'
      width="300" height="300"></img>
    )
  }

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
          {renderImg()}
        </div>
        <div className='displayName'>{profileInterface?.displayName}</div>
        <div>level: {profileInterface?.victories}</div>
        <div>{ matchHistory} </div>
      </div>
    </Default>
  )
}

export default PublicProfile;
