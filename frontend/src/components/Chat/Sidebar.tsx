import PublicList from "./Sidebar/PublicList";
import ChannelInterface from "./Interface/ChannelInterface";
import ChannelUserList from "./ChannelUserList";
import UserList from "./Sidebar/UserList";

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
