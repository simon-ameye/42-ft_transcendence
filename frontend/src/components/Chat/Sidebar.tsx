import Channel from "./Channel/Channel";
import ChannelList from "./Channel/ChannelList";

const Sidebar = () => {
    return (
        <div className='Sidebar'> sidebar
            <Channel/>
            <ChannelList/>
        </div>
    )
}
export default Sidebar;