import { ListItem } from '@mui/material'
import axios from 'axios';
import { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, InputAdornment, IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ChannelInterface from './Interface/ChannelInterface';
import UserInterface from './Interface/UserInterface';
import { TbKey, TbKeyOff, TbRefresh } from 'react-icons/tb';

export default function UserList({ actualChannelInterface }: { actualChannelInterface: ChannelInterface | undefined }) {
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
  const addUserToChannel = () => {
    if (!actualChannelInterface || !values) {
      alert('Options not completed')
      return;
    }
    axios.post('http://localhost:3001/chat/addUserToChannel', {
      channelId: actualChannelInterface?.id,
      otherUserId: values.userId,
    }).then(res => alert(res.data)).catch(err => alert(err))
  }

  const userList = userInterfaces.map((c, i) => (
    <ListItem key={i} onClick={event => handleClickOpen(c.id)} > {c.name}
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
    <div className='ChannelList'>
      <div className='header'>
        <div className='title'>All users</div>
        <TbRefresh className='refreshButton' onClick={getUserTable}>refresh users</TbRefresh>
      </div>
      <div className='list'>{userList}</div>
      <h2>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle><span style={{ color: 'black' }}>Chose action</span></DialogTitle>
          <DialogActions>
            <button onClick={startDirectConv}>start DIRECT conv</button>
          </DialogActions>
          <DialogActions>
            <button onClick={addUserToChannel}>addUserToChannel</button>
          </DialogActions>
          <DialogActions>
            <button onClick={handleClose}>Cancel</button>
          </DialogActions>
        </Dialog>
      </h2>
    </div >
  )
}
