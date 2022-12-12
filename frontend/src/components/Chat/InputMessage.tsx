import React, { useState } from 'react'
import { IoSend } from "react-icons/io5";
import axios from 'axios';
import ChannelInterface from './Interface/ChannelInterface';
import { convertToObject } from 'typescript';

const MessageInput = ({ actualChannelInterface }: { actualChannelInterface: ChannelInterface | undefined }) => {
  const [value, setValue] = useState<string>("");

  const sendMessage = async () => {
    if (value === "") return false;
    if (actualChannelInterface === undefined) {
      alert('Incomplete demand');
      return;
    }
    if (actualChannelInterface) {
      axios.post('http://localhost:3001/chat/sendMessage', {
        channelId: actualChannelInterface.id,
        text: value,
      }).then(res => res.data.length > 0 ? alert(res.data) : console.log('OK')).catch()
      setValue("");
    }
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === "Enter" && value !== "") {
      e.preventDefault();
      sendMessage();
    }
  }
  return (
    <div className="messageInput">
      <textarea
        onChange={(e) => setValue(e.target.value)}
        placeholder=" Type your message..."
        value={value}
        rows={3}
        onKeyDown={handleKeyDown}
        maxLength={200}
      />
      <IoSend size="20" onClick={sendMessage} className='iosend' />
    </div>
  )
}
export default MessageInput;