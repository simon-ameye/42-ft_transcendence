import InputMessage from './InputMessage'
import DirectMessage from './DirectMessage'
import ChannelInterface from './ChannelInterface'

const Chat = ({ actualChannelInterface }: { actualChannelInterface: ChannelInterface | undefined }) => {
  return (
    <div className='Chat'> {actualChannelInterface ? actualChannelInterface.name : "no channel selected"}
      <DirectMessage actualChannelInterface={actualChannelInterface} />
      <InputMessage actualChannelInterface={actualChannelInterface} />
    </div>
  )
}
export default Chat;