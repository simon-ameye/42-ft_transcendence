import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import io from 'socket.io-client';

const socket = io();

const Notifications = () => {
	const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);
	
  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    /*socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });*/

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const sendPing = () => {
    socket.emit('ping');
  }

  return (
		<div className='button'>
			<Navbar />
    		<div>
      		<p>Connected: { '' + isConnected }</p>
      		<p>Last pong: { lastPong || '-' }</p>
      		<button onClick={ sendPing }>Send ping</button>
    		</div>
		</div>
  );
};

export default Notifications;