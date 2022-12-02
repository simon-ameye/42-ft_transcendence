import { ListItem } from '@mui/material'
import FriendsInterface from '../FriendsInterface';
import axios from 'axios';
import { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, InputAdornment, IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { TbKey, TbKeyOff } from 'react-icons/tb';

export default function FriendList() {

  const [ friendsInterfaces, setfriendsInterfaces] = useState<FriendsInterface[]>([])
  const [open, setOpen] = useState(false);


  const handleStartConversation = (friendId : number) => {
    axios.post('http://localhost:3001/chat/createChannel', {
      name: "",
      mode: "DIRECT",
      password: "",
      otherUserId: friendId,
    }).then(res => console.log(res)).catch(err => console.log(err))
  }

  function getUserFriendTable() {
    axios.get('http://localhost:3001/chat/getUserFriendTable', {
    }).then(
      function (response) {
        setfriendsInterfaces(response.data.friendsInterfaces);
      }
    )
  }

  const friendList = friendsInterfaces.map((c, i) => (
    <ListItem key={i} onClick={event => handleStartConversation(c.id)} >{ <TbKey /> } {c.name}
    </ListItem>
  ))

  return (
    <div className='PublicList'>
      <button onClick={getUserFriendTable}>refresh friends</button>
      <div>
        {friendList}
      </div>
    </div>
  )
}
