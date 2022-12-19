import Navbar from '../Navbar';
import { ReactNode, useEffect, useState } from "react";
import axios from 'axios';
import ProfileInterface from './Interface/ProfileInterface';
import './style.scss'
import FileUpload from './upload';

const Profile = () => {
  const [profileInterface, setprofileInterface] = useState<ProfileInterface | undefined>()

  function getProfileInterface() {
    axios.get('http://localhost:3001/profile', {
    }).then(
      function (response) {
        setprofileInterface(response.data);
      }).catch(err => console.log(err));
  }

  function renderImg() {
    var path = ""
    if (profileInterface != undefined)
      path = "http:://localhost:3001/" + profileInterface?.imageUrl;
    return (
      <img src={path} alt="lol"></img>
    )
  }
  useEffect(() => {
    getProfileInterface()
  }, [])

  return (
    <div className='profile'>
      <Navbar />
      <FileUpload/>
      <div className='profileImage'>
        {renderImg()}
      </div>
      {/* <img src="/backend/uploads/default.png" alt="42-logo"></img> */}
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