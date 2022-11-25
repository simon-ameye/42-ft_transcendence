import Channel from "./Channel/Channel";
import ChannelInterface from './ChannelInterface';
import { useEffect, useState } from "react";
import { socket } from '../../App';
import ChannelList from "./Channel/ChannelList";


const Sidebar = ({channelInterfaces}:{channelInterfaces: ChannelInterface[]}) => {
  return (
      <div className='Sidebar'> sidebar
          <Channel/>
          <ChannelList channelInterfaces={channelInterfaces}/>
      </div>
  )
}
export default Sidebar;