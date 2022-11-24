import Channel from "./Channel/Channel";
import ChannelList from "./Channel/ChannelList";
import ChannelInterface from "./ChannelInterface";

const Sidebar = () => {
    return (
        <div className='Sidebar'> sidebar
            <Channel/> 
            <ChannelList />
        </div>
    )
}
export default Sidebar;