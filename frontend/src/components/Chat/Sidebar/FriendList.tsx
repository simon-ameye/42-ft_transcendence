import { ListItem } from '@mui/material'
import FriendsInterface from '../Interface/FriendsInterface';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, InputAdornment, IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { TbKey, TbKeyOff } from 'react-icons/tb';
import { useEffect, useState } from "react";

export default function FriendList() {

  const [friendsInterfaces, setfriendsInterfaces] = useState<FriendsInterface[]>([])
  const [open, setOpen] = useState(false);

  const handleStartConversation = (friendId: number) => {
    axios.post('http://localhost:3001/chat/createChannel', {
      name: "",
      mode: "DIRECT",
      password: "",
      otherUserId: friendId,
    }).then(res => res.data.length > 0 ? alert(res.data) : console.log('OK')).catch()
  }

  function getUserFriendTable() {
    axios.get('http://localhost:3001/chat/getUserFriendTable', {
    }).then(
      function (response) {
        setfriendsInterfaces(response.data.friendsInterfaces);
      }).catch(err => console.log(err));
  }

  const friendList = friendsInterfaces.map((c, i) => (
    <ListItem key={i} onClick={event => handleStartConversation(c.id)} > {c.name}
    </ListItem>
  ))

  useEffect(() => {
    getUserFriendTable()
  }, [])

  return (
    <div className='PublicList'>
      <button onClick={getUserFriendTable}>refresh friends</button>
      <div>
        <br></br>
        {friendList}
      </div>
    </div>
  )
}
