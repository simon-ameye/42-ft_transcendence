import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import Navbar from './Navbar';
import { ListItem } from '@mui/material'
import io, { Socket } from 'socket.io-client';

type User = {
  email: string;
  displayName: string;
  imageUrl: string;
  id: number;
  socketId: string;
}

type FriendRequest = {
  creator: number;
  receiver: number;
  // and a state ?
}

const socket = io("http://localhost:3001");

const Friends = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [friendRequest, setFriendRequest] = useState<FriendRequest>();

  const getUsers = () => {
    axios.get('http://localhost:3001/user/users',
      {
      }).then(
        function (response) {
          console.log('refresh')
          setUsers(response.data)
        }
      )
  }

  const sendFriendRequest = (userId: number) => {
    axios.post('http://localhost:3001/user/addFriend/', {
      userid: userId
    })
  }

  const userList = users.map((c, i) => (
    <ListItem key={i}> {
      <button onClick={event => sendFriendRequest(c.id)}> send </button>
    }
      {c.displayName}
    </ListItem >
  ))

  return (
    <div>
      <Navbar></Navbar>
      <button onClick={getUsers}></button>
      {userList}
      { /* {friendList} */}
    </div>
  )
}

export default Friends;



/*

client --> server
liste des tous les users (GET : getUsers()) => + bouton refresh
  bouton addFriend: PUT (userId: number)

Interfaces:
allUserInterface
userId : number
userName: string



server --> client
Liste des amis
a chaque connection / deconnection, le back envoie : + bouton refresh

Interfaces: 
friendsInterface
friendsNames: string
activity: boolean


userInterfaces
userId : number
userName: string
activity: boolean
*/