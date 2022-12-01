import Channel from "./Sidebar/Channel";
import PublicList from "./Sidebar/PublicList";
import ChannelInterface from './ChannelInterface';

const Sidebar = () => {
  return (
    <div className='Sidebar'> sidebar
      <Channel />
      <PublicList />
    </div>
  )
}
export default Sidebar;

//to put in return
//<ChannelList channelInterfaces={channelInterfaces} />
