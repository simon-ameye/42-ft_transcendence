import Channel from "./Sidebar/Channel";
import ChannelInterface from './ChannelInterface';
import { useEffect, useState } from "react";
import { socket } from '../../App';
import ChannelList from "./Sidebar/ChannelList";
import PublicList from "./Sidebar/PublicList";


const Sidebar = ({ channelInterfaces }: { channelInterfaces: ChannelInterface[] }) => {
  return (
    <div className='Sidebar'> sidebar
      <Channel />
      <ChannelList channelInterfaces={channelInterfaces} />
      <PublicList />
    </div>
  )
}
export default Sidebar;