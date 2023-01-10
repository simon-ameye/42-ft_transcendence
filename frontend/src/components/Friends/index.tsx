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
import { NavLink, Navigate, redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Default from '../../layouts/Default';
import './style.scss'

type User = {
  email: string;
  displayName: string;
  imageUrl: string;
  id: number;
  socketId: string;
  status: string;
};

type FriendRequest = {
  id: number;
  user_id: number;
  friend_id: number;
  status: string;
  user: User;
  friend: User;
};

const Friends = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [cookie] = useCookies(['displayName']);
  const navigate = useNavigate();
  const [receivedFriendRequest, setReceivedFriendRequest] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<User[]>([])

  const sendFriendRequest = (receiverId: number, socketId: string) => {
    socket.emit("add friend", receiverId, socketId);
  };

  const acceptFriendRequest = (relation: FriendRequest) => {
    socket.emit("accept friend", relation);
  };

  const denyFriendRequest = (relation: FriendRequest) => {
    socket.emit("deny friend", relation);
  };


  const userList = users.map((c, i) => (
    <div className="user">
      {c.displayName}
      <ListItem key={i}>
        {" "}
        {
          <button onClick={(event) => sendFriendRequest(c.id, c.socketId)}>
            Add <i className="fa-solid fa-plus"></i>
          </button>
        }
      </ListItem>
    </div>
  ));

  const receivedList = receivedFriendRequest.map((c, i) => (
    <>
      {c.user.displayName}
      <ListItem key={i}>
        {" "}
        {
          <div className="accept | deny">
            <button
              className="accept-btn"
              onClick={(event) => acceptFriendRequest(c)}
            >
              <i className="fa-solid fa-check"></i>
            </button>
            <button
              className="deny-btn"
              onClick={(event) => denyFriendRequest(c)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        }
      </ListItem>
    </>
  ));

  const friendList = friends.map((c, i) => (
    // friend component
    <li>
      {c.displayName} : {c.status}
      <ListItem key={i} onClick={(e) =>  navigate("/publicProfile/" + c.id)} />
    </li>
  ));

  useEffect(() => {
    axios
      .get("http://localhost:3001/user/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // needs modif
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("http://localhost:3001/user/friendsList")
        .then((res) => {
          setFriends(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/user/receivedfriendRequest")
      .then((res) => {
        setReceivedFriendRequest(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    socket.on("receive invitation", receiveFriendRequest);
    return () => {
      socket.off("receive invitation", receiveFriendRequest);
    };
  }, []);

  useEffect(() => {
    socket.on("accept friend", acceptedFriendRequest);
    return () => {
      socket.off("accept friend", acceptedFriendRequest);
    };
  }, [receivedFriendRequest]);

  useEffect(() => {
    socket.on("deny friend", deniedFriendRequest);
    return () => {
      socket.off("deny friend", deniedFriendRequest);
    };
  }, [receivedFriendRequest]);

  const deniedFriendRequest = (relation: FriendRequest) => {
    if (relation != undefined) {
      setReceivedFriendRequest(
        receivedFriendRequest.filter((item) => item.id != relation.id)
      );
    }
  };

  const acceptedFriendRequest = (request: User, relation: FriendRequest) => {
    setFriends((friends) => [...friends, request]);
    if (relation != undefined) {
      setReceivedFriendRequest(
        receivedFriendRequest.filter((item) => item.id != relation.id)
      );
    }
  };

  const receiveFriendRequest = (request: FriendRequest) => {
    if (request != undefined)
      setReceivedFriendRequest((receivedFriendRequest) => [
        ...receivedFriendRequest,
        request,
      ]);
  };

  return (
    <Default>
      <div className="friends-container">
        <div className="friends-panel">
          <h1>Users list :</h1>
          <div className="user-list">{userList}</div>
          <h1>Friend requests :</h1>
          <div className="friend-request">
            {receivedList.length ? (
              receivedList
            ) : (
              <span>No friends request</span>
            )}
          </div>
          <h1>Friends list :</h1>
          <div className="friend-list">
            <ul>
              {friendList.length ? friendList : <span>No friends, sad</span>}
            </ul>
          </div>
        </div>
      </div>
    </Default>
  );
};

export default Friends;
