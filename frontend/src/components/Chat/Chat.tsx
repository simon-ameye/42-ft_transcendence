import InputMessage from './InputMessage'
import DirectMessage from './DirectMessage'
import ChannelInterface from './ChannelInterface'
import ChannelSetting from './ChannelSetting';


const Chat = ({ actualChannelInterface }: { actualChannelInterface: ChannelInterface | undefined }) => {
 

  return (
    <div> 
        <h1 className='Chat_name'>
        {actualChannelInterface ? actualChannelInterface.name : "No channel selected" }
      </h1>
      <ChannelSetting actualChannelInterface={actualChannelInterface} />
      <DirectMessage actualChannelInterface={actualChannelInterface} />
      <InputMessage actualChannelInterface={actualChannelInterface} />
    </div>
  )
}
export default Chat;