import axios from "axios";
import React, { useState, useEffect } from "react";
import { ListItem } from "@mui/material";
import io, { Socket } from "socket.io-client";
import { useCookies } from "react-cookie";
import { socket } from "../../App";
import { request } from "http";
import User from "../User";
import { async } from "rxjs";
import Default from "../../layouts/Default";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import PlayerInterface from "../../interfaces/player.interface";

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
  const [gameList, setGameList] = useState<string[]>([]);

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

  const watchMatch = (strGame: string) => {
    const playerNames = strGame.split(" ");
    playerNames.splice(1, 1);
    socket.emit("watch game", playerNames);
    navigate('/game');
  };

  const GameInProgress = gameList.map((gameList, index) => (
    <ListItem onClick={() => watchMatch(gameList)} key={index}>
      {gameList}{" "}
    </ListItem>
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
    <li>
      <li title={c.status == "OFFLINE" ? "Offline" : "Online"}>
        {c.status == "OFFLINE" ? <div className='offline'></div> : <div className='online'></div>} {c.displayName}
        <span className="playing">{c.status == "PLAYING" ? c.status : ""}</span>
        <button className="fa-solid fa-user" onClick={(e) =>  navigate("/publicProfile/" + c.id)} ></button>
      </li>
      <ListItem key={i} />
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

  useEffect(() => {
      axios.get("http://localhost:3001/user/friendsList")
        .then((res) => {
          setFriends(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
  });

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

  useEffect(() => {
    axios
      .get("http://localhost:3001/game/list")
      .then((res) => {
        setGameList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    socket.on("update game list", updateGameListListener);
    return () => {
      socket.off("update game list", updateGameListListener);
    };
  });

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

  const updateGameListListener = (players: PlayerInterface[]) => {
    let strGame = players[0].displayName.concat(" vs ");
    strGame = strGame.concat(players[1].displayName);
    setGameList([...gameList, strGame]);
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
          <div className="game-progress-container">
            {
              GameInProgress.length != 0 && <div className="game-progress">
                Watch game in progress : {GameInProgress}</div>
            }
          </div>
        </div>
      </div>
    </Default>
  );
};

export default Friends;
