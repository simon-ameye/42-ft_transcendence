import React, { useEffect, useState } from 'react'
import io ,{Socket } from 'socket.io-client'
import InputMessage from './InputMessage'
import DirectMessage from './DirectMessage'
import { socket } from '../../App'
import ChannelInterface from './ChannelInterface'


const Chat = () => {

const [messages, setMessages] = useState<string[]>([])


  const messageListener = (channelInterface: ChannelInterface) => {
    console.log(channelInterface.id)
    console.log(channelInterface.name)
    console.log(channelInterface.mode)
    console.log(channelInterface.messages)
    console.log(channelInterface.authors)
    console.log(channelInterface.dates)
    console.log(channelInterface.isProtected)
  }

  useEffect(() => {
    socket.on('channelInterface', messageListener)
    return () => {
    }
  })

  return (
    <div>
      <DirectMessage messages={messages} />
      <InputMessage/>
    </div>
  )
}
export default Chat;