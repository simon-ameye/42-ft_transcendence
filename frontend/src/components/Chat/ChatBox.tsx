import Navbar from '../Navbar';
import Chat from './Chat';
import ChannelInterface from './ChannelInterface';
import { useEffect, useState } from "react";
import { socket } from '../../App';
import { ListItem } from '@mui/material'
import axios from 'axios';
import Channel from './Sidebar/Channel';
import Sidebar from './Sidebar';
import UserList from './UserList';

const Chatbox = () => {
  const [channelInterfaces, setchannelInterfaces] = useState<ChannelInterface[]>([])
  const [actualChannelInterface, setactualChannelInterface] = useState<ChannelInterface | undefined>()


  function sendAllChannelInterfaces() {
    setchannelInterfaces([]);
    setactualChannelInterface(undefined);
    axios.get('http://localhost:3001/chat/sendAllChannelInterfaces', {
    }).then(res => console.log(res)).catch(err => console.log(err))
  }

  function handleSelectChannel(channelId: number) {
    setactualChannelInterface(channelInterfaces.find((obj) => {
      return obj.id === channelId;
    }))
  }

  const channelList = channelInterfaces.map((c, i) => (

    <ListItem button key={i} onClick={event => handleSelectChannel(c.id)} > {c.name}
    </ListItem>
  ))

  function refreshActualChannelInterface() {
    var channelId = actualChannelInterface?.id
    setactualChannelInterface(channelInterfaces.find((obj) => {
      return obj.id === channelId;
    }))
  }

  const concatChannelInterfaces = (channelInterface: ChannelInterface) => {
    var tmpChannelInterfaces: ChannelInterface[]
    tmpChannelInterfaces = channelInterfaces;
    let alreadyKnownChannel = 0
    for (let i = 0; i < tmpChannelInterfaces.length; i++) {
      if (tmpChannelInterfaces[i].id == channelInterface.id) {
        tmpChannelInterfaces[i] = channelInterface
        alreadyKnownChannel = 1
        console.log("Known channel, replace it")
        break
      }
    }
    if (alreadyKnownChannel == 0) {
      console.log("Unknown channel, push it")
      tmpChannelInterfaces.push(channelInterface)
    }
    setchannelInterfaces([...tmpChannelInterfaces])
    console.log(channelInterfaces)
    refreshActualChannelInterface()
  }

  //use effect
  useEffect(() => {
    socket.on('channelInterface', concatChannelInterfaces)
    return () => {
      socket.off('channelInterface', concatChannelInterfaces)
    }
  })

  return (
    <div>
      <Navbar />
      <div className='chatbox'>
        {/* Left Side */}
        <div className='Left-side-chat'>
          <div className='chatbox-container'>
            <Channel />
            <div className='ChannelList'>
              <button onClick={sendAllChannelInterfaces}>Refresh Channels</button>
              {channelList}
              <Sidebar actualChannelInterface={actualChannelInterface} />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className='Right-side-chat'>
          <Chat actualChannelInterface={actualChannelInterface} />
        </div>
      </div>
    </div>
  )
}

export default Chatbox;