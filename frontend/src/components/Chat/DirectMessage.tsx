import ChannelInterface from './ChannelInterface';

const DirectMessage = ({ actualChannelInterface }: { actualChannelInterface: ChannelInterface | undefined }) => {

  const messageList =
    actualChannelInterface ? actualChannelInterface.messages.map((d) =>
      <li>
          <div className="directmessageauthor">{d.author}</div>
          <div className="directmessagedate">{d.date}</div>
          <div className="directmessagemessage">{d.message}</div>
      </li>)
      : <li>Please select a channel </li>;

  return (
    <div className='directmessage' >
      {messageList}
    </div>
  )
}
export default DirectMessage;