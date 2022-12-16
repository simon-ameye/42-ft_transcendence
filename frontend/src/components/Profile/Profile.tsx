import Navbar from '../Navbar';
import { useEffect, useState } from "react";
import { socket } from '../../App';
import { ListItem } from '@mui/material'
import axios from 'axios';
import { TbKey, TbKeyOff, TbRefresh } from 'react-icons/tb';
import { RiChat3Fill } from 'react-icons/ri';
import { RiChatPrivateFill } from 'react-icons/ri';
import { BsFillPeopleFill } from 'react-icons/bs';
import ProfileInterface from './Interface/ProfileInterface';
import './style.scss'


const Profile = () => {
  const [profileInterface, setprofileInterface] = useState<ProfileInterface | undefined>()
  const [userProfilePicture, setUserProfilePicture] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // downoad image and stock the path to it
    axios.post('http://localhost:3001/profile/uploadImage', {
      imageUrl: userProfilePicture
    })
      .then()
      .catch(err => console.log(err))
  }

  function getProfileInterface() {
    axios.get('http://localhost:3001/profile', {
    }).then(
      function (response) {
        setprofileInterface(response.data);
      }).catch(err => console.log(err));
  }
  
  /*function getProfileImage() {
    axios.get('http://localhost:3001/profile/getImage', {
    }).then(
      function (response) {
        setprofileInterface(response.data);
      }).catch(err => console.log(err));
  }*/

  useEffect(() => {
    getProfileInterface()
  }, [])

  /*useEffect(() => {
    getProfileImage()
  }, [])*/

  return (
    <div className='profile'>
      <Navbar />
      <div className='email'>{profileInterface?.email}</div>
      <div className='displayName'>{profileInterface?.displayName}</div>
      <div className='profileImage'> profile image : {userProfilePicture}</div>
      {/* <div>matching: {profileInterface?.matching}</div> */}
      {/* <div>inGame: {profileInterface?.inGame}</div> */}
      {/* <div>victories: {profileInterface?.victories}</div> */}
      {/* <div>log: {profileInterface?.log}</div> */}
      {/* <div>friends: {profileInterface?.friends}</div> */}
      {/* <div>blockedUserIds: {profileInterface?.blockedUserIds}</div> */}
      <form onSubmit={handleSubmit}>
      <input
        id="file"
        type="file"
        value={userProfilePicture}
        onChange={(e) => setUserProfilePicture(e.target.value)}
      />
      <div className="uploadProfileImage">
        <label className="upload" htmlFor="file">Upload profile picture</label>
        <button type="submit" className='submit-btn'>submit</button>
      </div>
      </form>
    </div>
  )
}

export default Profile;