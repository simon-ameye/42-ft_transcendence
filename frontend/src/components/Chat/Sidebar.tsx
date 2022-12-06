import PublicList from "./Sidebar/PublicList";
import FriendList from "./Sidebar/FriendList"
import ChannelInterface from "./Interface/ChannelInterface";
import ChannelUserList from "./ChannelUserList";
import UserList from "./UserList";

const Sidebar = ({ actualChannelInterface }: { actualChannelInterface: ChannelInterface | undefined }) => {
  return (
    <div>
      <PublicList />
      <ChannelUserList actualChannelInterface={actualChannelInterface} />
      <UserList actualChannelInterface={actualChannelInterface} />
    </div>
  )
}
export default Sidebar;
