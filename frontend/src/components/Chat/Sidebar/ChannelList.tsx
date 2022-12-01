import { ListItem } from '@mui/material'
import ChannelInterface from '../ChannelInterface';
import axios from 'axios';
import ChannelsInterface from '../ChannelsInterface';
import { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, InputAdornment, IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { TbKey, TbKeyOff } from 'react-icons/tb';


export default function ChannelList({ channelInterfaces }: { channelInterfaces: ChannelInterface[] }) {

  function sendAllChannelInterfaces() {
    axios.get('http://localhost:3001/chat/sendAllChannelInterfaces', {
    }).then(res => console.log(res)).catch(err => console.log(err))
  }

  function handleClickOpen() {

  }

  const channelList = channelInterfaces.map((c, i) => (
    <ListItem button key={i} onClick={event => handleClickOpen()} > {c.name}
    </ListItem>
  ))

  return (
    <div className='ChannelList'>
      <button onClick={sendAllChannelInterfaces}>Refresh Channels</button>
      <div>
        {channelList}
      </div>
    </div>
  )
}