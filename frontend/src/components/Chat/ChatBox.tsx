import Navbar from '../Navbar';
import Chat from './Chat';
import Sidebar from './Sidebar';
import ChannelInterface from './ChannelInterface';
import { useEffect, useState } from "react";
import { socket } from '../../App';
import { ListItem } from '@mui/material'
import axios from 'axios';

const Chatbox = () => {
  const [channelInterfaces, setchannelInterfaces] = useState<ChannelInterface[]>([])
  const [actualChannelInterface, setactualChannelInterface] = useState<ChannelInterface | undefined>()


  function sendAllChannelInterfaces() {
    axios.get('http://localhost:3001/chat/sendAllChannelInterfaces', {
    }).then(res => console.log(res)).catch(err => console.log(err))
  }

  function handleSelectChannel(channelId: number) {
      setactualChannelInterface(channelInterfaces.find((obj) => {
        return obj.id === channelId;
      }))
      console.log('yooo')
      console.log(actualChannelInterface)
      console.log('/yooo')

  }

  const channelList = channelInterfaces.map((c, i) => (
    <ListItem key={i} onClick={event => handleSelectChannel(c.id)} > {c.name}
    </ListItem>
  ))

  function refreshActualChannelInterface()
  {
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
        <div className='ChannelList'>
          <button onClick={sendAllChannelInterfaces}>Refresh Channels</button>
          {channelList}
        </div>
        <div className='chatbox-container'>
          <Sidebar />
          <Chat actualChannelInterface={actualChannelInterface} />
        </div>
      </div>
    </div>
  )
}

export default Chatbox;