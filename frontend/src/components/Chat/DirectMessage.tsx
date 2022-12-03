import ChannelInterface from './Interface/ChannelInterface';
import React, { useEffect } from 'react'

const DirectMessage = ({ actualChannelInterface }: { actualChannelInterface: ChannelInterface | undefined }) => {

  const Scrollmessage = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const domNode = Scrollmessage.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  })
  const messageList =
    actualChannelInterface ? actualChannelInterface.messages.map((d) =>
      <li>
          <div className="directmessageauthor">{d.author}</div>
          <div className="directmessagedate">{d.date}</div>
          <div className="directmessagemessage">{d.message}</div>
      </li>)
      : <li> Please select a channel </li>;

  return (
    <div className='directmessage' ref={Scrollmessage} >
      {messageList}
    </div>
  )
}
export default DirectMessage;