import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import io, {Socket} from 'socket.io-client';
import { EmitFlags } from 'typescript';
import axios from 'axios';
/// just for testing everithing for friends

const socket = io("http://localhost:3001");

const Notifications = () => {
  const [Friendrequest, setFriendrequest] = useState("");
  const [receivedRequest, setReceivedRequest] = useState("");

  const sendFriendRequest = () => {
    socket.emit("sendFriendRequest", { Friendrequest });
  };

  const getUsers = () => {
		axios.get('http://localhost:3001/user/users', {
		})
			.then(res => console.log(res))
			.catch(err => console.log(err));
	}

  useEffect( () => {
    socket.on("receiveFriendRequest", (data) => {
      setReceivedRequest(data.Friendrequest); // here my friend request
    })
  }, [socket] )

  // here we will just need 
  // notif + accept or not
  /// do sending request on another button

  return (
    <div>
      <Navbar/>
      <input
        placeholder='Friendrequest'
        onChange={(event) => {
          setFriendrequest(event.target.value);
        }}
      />
      <button onClick={sendFriendRequest}>Send Friendrequest</button>
      <h1>Received Requests</h1>
      {receivedRequest}
      {/*<h1>Sent Requests</h1> */}
      {/* {sentRequest} */}
      { /*<button onClick={showFriendRequest}>Show Friendrequest</button> */}
     </div>
  )
}

export default Notifications;
