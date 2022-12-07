import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Auth from '../Auth';
import Navbar from '../Navbar';

type User = {
  //token: string; // the token to indentify the user ( NOT SECURE )
  email: string;
  displayName: string;
  imageUrl: string;
  id: number;
  socketId: string;
}

const Profile = () => {
  const [users, setUsers] = useState<User[]>([]);

  const getUser = () => {
    axios.get('http://localhost:3001/user', {
    })
      .then(res => {
        console.log("test", res.data)
      })
      .catch(err => console.log(err));
  }

  return (
    // users component with all users and their status ( needs socket )
    <div>
      <Navbar />
      <h1> Profile </h1>
      <div className='profile'>
      </div>
      <div className='listUsers'>
      </div>
      <div className='friends'>
      </div>
    </div>
  )
}

export default Profile;
