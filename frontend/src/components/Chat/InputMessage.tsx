import React, { useState } from 'react'
import { IoSend } from "react-icons/io5";

const MessageInput = ({ }) => {
  const [value, setValue] = useState<string>("");
  const date = new Date();
  const time = date.getHours()
    + ':' + ((date.getMinutes() < 10 ? '0' : '') + date.getMinutes());

  const sendMessage = async () => {
    if (value === "") return false;


  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === "Enter" && value !== "") {
      e.preventDefault();

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
      />
      <IoSend size="40" onClick={sendMessage} className='iosend' />

    </div>
  )
}
export default MessageInput;