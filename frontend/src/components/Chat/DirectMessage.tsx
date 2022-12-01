import React, { useEffect } from 'react'
import ChannelInterface from './ChannelInterface';
import { ListItem } from '@mui/material'
import axios from 'axios';

const DirectMessage = ({ actualChannelInterface }: { actualChannelInterface: ChannelInterface | undefined }) => {

  const messageList =
    actualChannelInterface ? actualChannelInterface.messages.map((d) => <li>{d}</li>) : <li>Please select a channel</li>;

  return (
    <div className='directmessage' >
      {messageList}
    </div>
  )
}
export default DirectMessage;