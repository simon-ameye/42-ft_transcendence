import {ListItem} from '@mui/material'
import ChannelInterface from '../ChannelInterface';
import { useEffect, useState } from "react";
import { socket } from '../../../App';


const ChannelList = () =>{
  const [channelInterfaces, setchannelInterfaces] = useState<ChannelInterface[]>([])

    const messageListener = (channelInterface: ChannelInterface) => {
        setchannelInterfaces([channelInterface, ...channelInterfaces])
        console.log(channelInterface)
    }
    
      useEffect(() => {
        socket.on('channelInterface', messageListener)
        return () => {
          socket.off('channelInterface', messageListener)
        }
      },)

return (
 
  <div>
     {channelInterfaces.map((channelInterface) => {
                      return   <ListItem key={channelInterface.id}>{channelInterface.name}</ListItem>
                    })}
  </div>
)
}

export default ChannelList;