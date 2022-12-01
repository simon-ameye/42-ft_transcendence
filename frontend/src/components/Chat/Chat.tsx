import React, { useEffect, useState } from 'react'
import InputMessage from './InputMessage'
import DirectMessage from './DirectMessage'
import { socket } from '../../App'
import ChannelInterface from './ChannelInterface'


const Chat = () => {

  const [messages, setMessages] = useState<string[]>([])

  return (
    <div>
      <DirectMessage messages={messages} />
      <InputMessage />
    </div>
  )
}
export default Chat;