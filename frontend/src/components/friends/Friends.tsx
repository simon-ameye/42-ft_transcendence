import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Auth from '../Auth';
import Navbar from '../Navbar';
import { ListItem } from '@mui/material'
import io, { Socket } from 'socket.io-client';
import { useCookies } from 'react-cookie';
import { socket } from '../../App';
import { request } from 'http';
import User from '../User';
import { async } from 'rxjs';

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
  user: User;
  friend: User;
}

/// needs another component to listen on invit in all app

const Friends = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [cookie] = useCookies(['displayName']);
  const [receivedFriendRequest, setReceivedFriendRequest] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<User[]>([])

  const sendFriendRequest = (receiverId: number, socketId: string) => {
    socket.emit("add friend", receiverId, socketId);
  }

  const acceptFriendRequest = (relation: FriendRequest) => {
    socket.emit("accept friend", relation);
  }

  const denyFriendRequest = (relation: FriendRequest) => {
    socket.emit("deny friend", relation);
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
        <button onClick={event => acceptFriendRequest(c)}> accept </button>
        <button onClick={event => denyFriendRequest(c)}> deny  </button>
      </div>
    }
      {c.user.displayName}

      {/* <>{console.log(receivedFriendRequest)}</> */}
    </ListItem >
  ))

  const friendList = friends.map((c, i) => (
    // friend component
    <ListItem key={i}>
      {c.displayName}
    </ListItem >
  ))

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
    axios.get('http://localhost:3001/user/friendsList')
      .then(res => {
        setFriends(res.data);
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
  }, []);

  useEffect(() => {
    socket.on("accept friend", acceptedFriendRequest);
    return () => {
      socket.off("accept friend", acceptedFriendRequest);
    }
  }, [receivedFriendRequest]);

  useEffect(() => {
    socket.on("deny friend", deniedFriendRequest);
    return () => {
      socket.off("deny friend", deniedFriendRequest);
    }
  }, [receivedFriendRequest]);

  const deniedFriendRequest = (relation: FriendRequest) => {
    if (relation != undefined) {
      setReceivedFriendRequest(receivedFriendRequest.filter(item => item.id != relation.id))
    }
  }

  const acceptedFriendRequest = (request: User, relation: FriendRequest) => {
    setFriends(friends => [...friends, request])
    if (relation != undefined) {
      setReceivedFriendRequest(receivedFriendRequest.filter(item => item.id != relation.id))
    }
  }

  const receiveFriendRequest = (request: FriendRequest) => {
    if (request != undefined)
      setReceivedFriendRequest(receivedFriendRequest => [...receivedFriendRequest, request])
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
      <div>
        <h1>friends</h1>
        {friendList}
      </div>
    </div>
  )
}

export default Friends;
