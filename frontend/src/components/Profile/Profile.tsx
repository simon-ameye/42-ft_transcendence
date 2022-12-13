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
        setprofileInterface(response.data);
      }).catch(err => console.log(err));
  }

  useEffect(() => {
    getProfileInterface()
  }, [])

  return (
    <div>
      <Navbar />
      <div>id: {profileInterface?.id}</div>
      <div>createdAt: {profileInterface?.createdAt}</div>
      <div>updatedAt: {profileInterface?.updatedAt}</div>
      <div>email: {profileInterface?.email}</div>
      <div>hash: {profileInterface?.hash}</div>
      <div>displayName: {profileInterface?.displayName}</div>
      <div>imageUrl: {profileInterface?.imageUrl}</div>
      <div>googleSecret: {profileInterface?.googleSecret}</div>
      <div>socketId: {profileInterface?.socketId}</div>
      <div>blockedUserIds: {profileInterface?.blockedUserIds}</div>
      <div>friends: {profileInterface?.friends}</div>
      <div>matching: {profileInterface?.matching}</div>
      <div>inGame: {profileInterface?.inGame}</div>
      <div>victories: {profileInterface?.victories}</div>
      <div>log: {profileInterface?.log}</div>
    </div>
  )
}

export default Profile;