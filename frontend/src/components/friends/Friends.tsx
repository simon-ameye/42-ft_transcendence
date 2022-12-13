import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Auth from '../Auth';
import Navbar from '../Navbar';
import { ListItem } from '@mui/material'
import io, { Socket } from 'socket.io-client';
import { useCookies } from 'react-cookie';
import { socket } from '../../App';

type User = {
  email: string;
  displayName: string;
  imageUrl: string;
  id: number;
  socketId: string;
}

type FriendRequest = {
  id: number;
  user_id: number;
  friend_id: number;
  status: string;
}

/// needs another component to listen on invit in all app

const Friends = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [cookie] = useCookies(['displayName']);
  const [receivedFriendRequest, setReceivedFriendRequest] = useState<FriendRequest[]>([]);

  const sendFriendRequest = (receiverId: number, socketId: string) => {
    socket.emit("add friend", receiverId, socketId);
  }

  const acceptFriendRequest = (requestId: number) => {
    socket.emit("accept friend", requestId);
  }

  const denyFriendRequest = (requestId: number) => {
    socket.emit("deny friend", requestId);
  }

  const userList = users.map((c, i) => (
    <ListItem key={i}> {
      <button onClick={event => sendFriendRequest(c.id, c.socketId)}> send </button>
    }
      {c.displayName}
    </ListItem >
  ))

  const receivedList = receivedFriendRequest.map((c, i) => (
    <ListItem key={i}> {
      <div className='accept | deny'>
        <button onClick={event => acceptFriendRequest(c.id)}> accept </button>
        <button onClick={event => denyFriendRequest(c.id)}> deny  </button>
      </div>
    }
      {c.user_id}
    </ListItem >
  ))

  // use effects

  useEffect(() => {
    axios.get('http://localhost:3001/user/users')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3001/user/receivedfriendRequest')
      .then(res => {
        setReceivedFriendRequest(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  useEffect(() => {
    socket.on("receive invitation", receiveFriendRequest);
    return () => {
      socket.off("receive invitation", receiveFriendRequest);
    }
  });

  // listeners

  const receiveFriendRequest = (request: FriendRequest) => {
    if (request == null)
      console.log("nulll");
    setReceivedFriendRequest([...receivedFriendRequest, request])
  }

  return (
    <div>
      <Navbar></Navbar>
      <h1>Users</h1>
      {userList}
      <div>
        <h1>friend requests</h1>
        {receivedList}
      </div>
    </div>
  )
}

export default Friends;

