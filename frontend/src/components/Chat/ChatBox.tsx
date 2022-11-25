import Navbar from '../Navbar';
import Chat from './Chat';
import Sidebar from './Sidebar';
import ChannelInterface from './ChannelInterface';
import { useEffect, useState } from "react";
import { socket } from '../../App';

const Chatbox = () =>
{
  const [channelInterfaces, setchannelInterfaces] = useState<ChannelInterface[]>([])

  //functions
  const concatChannelInterfaces = (channelInterface : ChannelInterface) => {
    var tmpChannelInterfaces : ChannelInterface[]
    tmpChannelInterfaces  = channelInterfaces;
    let alreadyKnownChannel = 0
    for (let i = 0; i < tmpChannelInterfaces.length; i++)
    {
      if (tmpChannelInterfaces[i].id == channelInterface.id)
      {
        tmpChannelInterfaces[i] = channelInterface
        alreadyKnownChannel = 1
        console.log("Known channel, replace it")
        break
      }
    }
    if (alreadyKnownChannel == 0)
    {
      console.log("Unknown channel, push it")
      tmpChannelInterfaces.push(channelInterface)
    }
    setchannelInterfaces([...tmpChannelInterfaces])
    console.log(channelInterfaces)
  }

  //use effect
  useEffect(() => {
    socket.on('channelInterface', concatChannelInterfaces)
    return () => {
      socket.off('channelInterface', concatChannelInterfaces)
    }})

  return (
  <div>
      <Navbar/>
          <div className='chatbox'>
              <div className='chatbox-container'>
                  <Sidebar channelInterfaces={channelInterfaces}/>
                  <Chat/>
          </div>
      </div>
  </div>
  )
}

export default Chatbox;