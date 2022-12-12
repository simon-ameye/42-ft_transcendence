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


const Profile = () => {
  const [profileInterface, setprofileInterface] = useState<ProfileInterface | undefined>()

  function getProfileInterface() {
    axios.get('http://localhost:3001/profile/getProfile', {
    }).then(
      function (response) {
        setprofileInterface(response.data.friendsInterfaces);
      }).catch(err => console.log(err));
  }

  useEffect(() => {
    getProfileInterface()
  }, [])

  return (
    <div>
      <Navbar />
      id: {profileInterface?.id}
      createdAt: {profileInterface?.createdAt}
      updatedAt: {profileInterface?.updatedAt}
      email: {profileInterface?.email}
      hash: {profileInterface?.hash}
      displayName: {profileInterface?.displayName}
      imageUrl: {profileInterface?.imageUrl}
      googleSecret: {profileInterface?.googleSecret}
      socketId: {profileInterface?.socketId}
      blockedUserIds: {profileInterface?.blockedUserIds}
      friends: {profileInterface?.friends}
      matching: {profileInterface?.matching}
      inGame: {profileInterface?.inGame}
      victories: {profileInterface?.victories}
      log: {profileInterface?.log}
    </div>
  )
}

export default Profile;