import { ListItem } from '@mui/material'
import axios from 'axios';
import { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, InputAdornment, IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { TbKey, TbKeyOff } from 'react-icons/tb';
import ChannelInterface from './Interface/ChannelInterface';
import UserInterface from './Interface/UserInterface';

export default function ChannelUserList({ actualChannelInterface }: { actualChannelInterface: ChannelInterface | undefined }) {

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    channelId: 0,
    userId: 0,
    minutes: 0,
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
      minutes: 0,
    })
    setOpen(false)
  }

  const banUser = () => {
    axios.post('http://localhost:3001/chat/banUser', {
      channelId: actualChannelInterface?.id,
      banedId: values.userId,
    }).then(res => alert(res.data)).catch(err => alert(err))
  }
  const blockUser = () => {
    axios.post('http://localhost:3001/chat/blockUser', {
      blockedUserId: values.userId,
    }).then(res => alert(res.data)).catch(err => alert(err))
  }
  const makeUserAdmin = () => {
    axios.post('http://localhost:3001/chat/makeUserAdmin', {
      channelId: actualChannelInterface?.id,
      newAdminId: values.userId,
    }).then(res => alert(res.data)).catch(err => alert(err))
  }
  const muteUser = () => {
    axios.post('http://localhost:3001/chat/muteUser', {
      channelId: actualChannelInterface?.id,
      muteId: values.userId,
      minutes: values.minutes,
    }).then(res => alert(res.data)).catch(err => alert(err))
  }
  const inviteToGame = () => {
    alert('not done yet')
  }
  const accessUserProfile = () => {
    alert('not done yet')
  }

  const userList = actualChannelInterface?.users.map((c, i) => (
    <ListItem key={i} onClick={event => handleClickOpen(c.id)} > {c.name}
    </ListItem>
  ))


  return (
    <div className='ChannelList'>
      <div className='header'>
        <div className='title'>Channel users</div>
      </div>
      <div className='list'>{userList}</div>
      <h2>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle><span style={{ color: 'black' }}>Chose action</span></DialogTitle>
          <DialogActions>
            <button onClick={banUser}>banUser</button>
          </DialogActions>
          <DialogActions>
            <button onClick={blockUser}>blockUser</button>
          </DialogActions>
          <DialogActions>
            <button onClick={makeUserAdmin}>makeUserAdmin</button>
          </DialogActions>
          <TextField
            type={"number"}
            InputProps={{
              inputProps: { min: 0 }
            }}
            label="mute time in minutes"
            style={{
              padding: 5
            }}
            onChange={(e: any) => {
              setValues({ ...values, minutes: e.target.value })
            }}
          />
          <DialogActions>
            <button onClick={muteUser}>muteUser</button>
          </DialogActions>
          <DialogActions>
            <button onClick={inviteToGame}>inviteToGame</button>
          </DialogActions>
          <DialogActions>
            <button onClick={accessUserProfile}>accessUserProfile</button>
          </DialogActions>
          <DialogActions>
            <button onClick={handleClose}>Cancel</button>
          </DialogActions>
        </Dialog>
      </h2>
    </div >
  )
}
