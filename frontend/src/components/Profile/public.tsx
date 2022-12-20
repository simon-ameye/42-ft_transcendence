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

  useEffect(() => {
    axios.get('http://localhost:3001/profile/findbyId/:id', {params:{ id: id }}
    ).then(
      function (response) {
        console.log(id)
        setprofileInterface(response.data);
      }).catch(err => console.log(err));
  }, [])

  useEffect(() => {
    /// add friendList of a specific id
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
          {/* {renderImg()} */}
          <img className='profileImage' src="http://localhost:3001/profile/getImage" alt='profileImage'
            width="300" height="300">
          </img> 
        </div>
        <div className='displayName'>{profileInterface?.displayName}</div>
        <div className='friendList'>
          {/* <h3>friends</h3> */}
          {/* {friendList} */}
        </div>
        <div>victories: {profileInterface?.victories}</div>
        {/* <div className='email'>{profileInterface?.email}</div> */}
        {/* <div>matching: {profileInterface?.matching}</div> */}
        {/* <div>inGame: {profileInterface?.inGame}</div> */}
        {/* <div>log: {profileInterface?.log}</div> */}
        {/* <div>blockedUserIds: {profileInterface?.blockedUserIds}</div> */}
      </div>
    </Default>
  )
}

export default PublicProfile;
