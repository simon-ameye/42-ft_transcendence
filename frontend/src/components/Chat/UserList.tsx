import { ListItem } from '@mui/material'
import axios from 'axios';
import { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, InputAdornment, IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { TbKey, TbKeyOff } from 'react-icons/tb';
import ChannelInterface from './Interface/ChannelInterface';
import UserInterface from './Interface/UserInterface';

export default function UserList() {
  const [userInterfaces, setuserInterfaces] = useState<UserInterface[]>([])

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    channelId: 0,
    userId: 0,
  })
  const handleClickOpen = (userId: number) => {
    setValues({ ...values, userId: userId });
    setOpen(true);
  }
  const handleVisibility = () => {
    setValues({
      ...values,
    });
  };
  const handleClose = () => {
    setValues({
      channelId: 0,
      userId: 0,
    })
    setOpen(false)
  }


  const startDirectConv = () => {
    axios.post('http://localhost:3001/chat/createChannel', {
      name: "",
      mode: "DIRECT",
      password: "",
      otherUserId: values.userId,
    }).then(res => alert(res.data)).catch(err => alert(err))
  }
  const blockUser = () => {
    axios.post('http://localhost:3001/chat/blockUser', {
      blockedUserId: values.userId,
    }).then(res => alert(res.data)).catch(err => alert(err))
  }
  const makeUserAdmin = () => {
    axios.post('http://localhost:3001/chat/makeUserAdmin', {
      //channelId: actualChannelInterface?.id,
      //newAdminId: values.userId,
    }).then(res => alert(res.data)).catch(err => alert(err))
  }
  const muteUser = () => {
    axios.post('http://localhost:3001/chat/muteUser', {
      //channelId: actualChannelInterface?.id,
      //muteId: values.userId,
      //minutes: values.minutes,
    }).then(res => alert(res.data)).catch(err => alert(err))
  }
  const inviteToGame = () => {
    alert('not done yet')
  }
  const accessUserProfile = () => {
    alert('not done yet')
  }


  const userList = userInterfaces.map((c, i) => (
    <ListItem button key={i} onClick={event => handleClickOpen(c.id)} > {c.name}
    </ListItem>
  ))

  function getUserTable() {
    axios.get('http://localhost:3001/chat/getUserTable', {
    }).then(
      function (response) {
        setuserInterfaces(response.data.usersInterfaces);
      }
    )
  }

  return (
    <div className='PublicList'>
      <div>
        <br></br>
        Complete User list
        <button onClick={getUserTable}>refresh users</button>

        {userList}
        <h2>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle><span style={{ color: 'black' }}>Chose action</span></DialogTitle>
            <DialogActions>
              <button onClick={startDirectConv}>start DIRECT conv</button>
            </DialogActions>
            <DialogActions>
              <button onClick={blockUser}>addToPrivateChannel</button>
            </DialogActions>
            <DialogActions>
              <button onClick={handleClose}>Cancel</button>
            </DialogActions>
          </Dialog>
        </h2>
      </div >
    </div >
  )
}
