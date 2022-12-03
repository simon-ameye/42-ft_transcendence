import PublicList from "./Sidebar/PublicList";
import FriendList from "./Sidebar/FriendList"
import ChannelInterface from "./Interface/ChannelInterface";
import UserList from "./UserList";

const Sidebar = ({ actualChannelInterface }: { actualChannelInterface: ChannelInterface | undefined }) => {
  return (
    <div>
      <PublicList />
      <FriendList />
      <UserList actualChannelInterface={actualChannelInterface} />
    </div>
  )
}
export default Sidebar;
