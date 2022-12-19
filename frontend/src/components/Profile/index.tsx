import Navbar from '../Navbar';
import { useEffect, useState } from "react";
import axios from 'axios';
import ProfileInterface from './Interface/ProfileInterface';
import './style.scss'
import FileUpload from './upload';

const Profile = () => {
  const [profileInterface, setprofileInterface] = useState<ProfileInterface | undefined>()
  const [ProfilePicture, setProfilePicture] = useState()

  function getProfileInterface() {
    axios.get('http://localhost:3001/profile', {
    }).then(
      function (response) {
        setprofileInterface(response.data);
      }).catch(err => console.log(err));
  }
  
  function getProfileImage() {
    axios.get('http://localhost:3001/profile/getImage', {
    }).then(
      function (response) {
        setProfilePicture(response.data)
      }).catch(err => console.log(err));
  }

  useEffect(() => {
    getProfileInterface()
  }, [])

  useEffect(() => {
    getProfileImage()
  }, [])

  return (
    <div className='profile'>
      <Navbar />
      <FileUpload/>
      {/* <div className='email'>{profileInterface?.email}</div> */}
      {/* <div className='displayName'>{profileInterface?.displayName}</div> */}
      {/* <div className='profileImage'> profile image : {userProfilePicture}</div> */}
      {/* <div>matching: {profileInterface?.matching}</div> */}
      {/* <div>inGame: {profileInterface?.inGame}</div> */}
      {/* <div>victories: {profileInterface?.victories}</div> */}
      {/* <div>log: {profileInterface?.log}</div> */}
      {/* <div>friends: {profileInterface?.friends}</div> */}
      {/* <div>blockedUserIds: {profileInterface?.blockedUserIds}</div> */}
    </div>
  )
}

export default Profile;