import InputMessage from './InputMessage'
import DirectMessage from './DirectMessage'
import ChannelInterface from './ChannelInterface'

const Chat = ({ actualChannelInterface }: { actualChannelInterface: ChannelInterface | undefined }) => {
  return (
    <div className='Chat'> 
    <div className='Chat_name'>
      <h1>
        {actualChannelInterface ? actualChannelInterface.name : "No channel selected"}
      </h1>
      </div>
      <DirectMessage actualChannelInterface={actualChannelInterface} />
      <InputMessage actualChannelInterface={actualChannelInterface} />
    </div>
  )
}
export default Chat;