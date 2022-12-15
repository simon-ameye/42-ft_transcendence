import InputMessage from './InputMessage'
import DirectMessage from './DirectMessage'
import ChannelInterface from './Interface/ChannelInterface'
import ChannelSetting from './ChannelSetting';


const Chat = ({ actualChannelInterface }: { actualChannelInterface: ChannelInterface | undefined }) => {


  return (
    <div>
      <h1 className='Chat_name'>
        {actualChannelInterface ? actualChannelInterface.name : "No channel selected"}
        <ChannelSetting actualChannelInterface={actualChannelInterface} />
      </h1>
      <DirectMessage actualChannelInterface={actualChannelInterface} />
      <InputMessage actualChannelInterface={actualChannelInterface} />
    </div>
  )
}
export default Chat;