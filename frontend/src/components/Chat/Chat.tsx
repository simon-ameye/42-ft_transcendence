import React, { useEffect, useState } from 'react'
import io ,{Socket } from 'socket.io-client'
import InputMessage from './InputMessage'
import DirectMessage from './DirectMessage'



const Chat = () => {
const [socket, setSocket] = useState<Socket>()
const [messages, setMessages] = useState<string[]>([])


  const messageListener = () => {
  //const messageListener = () => {
    console.log("messageListener")
    console.log("blibli")
    //console.log(id)
    //console.log(name)
  }

  useEffect(() => {
    socket?.on('channelInterface', messageListener)
    return () => {
      socket?.off("channelInterface", messageListener)
      console.log("blablabla3")
      //console.log(messageListener.id)
      //console.log(messageListener.name)
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