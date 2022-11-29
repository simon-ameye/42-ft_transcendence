import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

type User = {
  //token: string; // the token to indentify the user ( NOT SECURE )
  email: string;
  displayName: string;
  imageUrl: string;
  id: number;
	socketId: string;
}



const Profile = () =>  {

  const getUser = () => {
    axios.get('http://localhost:3001/user', {
		})
			.then(res => {
        console.log(res)
        
      })
			.catch(err => console.log(err));
  }
  return (
    <div>
      <Navbar/>
      <h1> Profile </h1>
        <div className='profile'>

        </div>
        <div className='users'>
          <ul>
            {

            }
          </ul>
        </div>
        <div className='friends'>
        </div>
    </div>
  )
}

export default Profile;
