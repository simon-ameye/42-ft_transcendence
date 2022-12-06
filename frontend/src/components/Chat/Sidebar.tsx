import PublicList from "./Sidebar/PublicList";
import FriendList from "./Sidebar/FriendList"
import ChannelInterface from "./Interface/ChannelInterface";
import ChannelUserList from "./ChannelUserList";
import UserList from "./UserList";

const Sidebar = ({ actualChannelInterface }: { actualChannelInterface: ChannelInterface | undefined }) => {
  return (
    <>
      <ChannelUserList actualChannelInterface={actualChannelInterface} />
      <PublicList />
      <UserList actualChannelInterface={actualChannelInterface} />
    </>
  )
}
export default Sidebar;
