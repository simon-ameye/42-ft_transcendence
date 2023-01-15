import { ListItem } from '@mui/material'
import axios from 'axios';
import { useState } from 'react'
import { Dialog, DialogActions, DialogTitle, TextField } from '@mui/material'
import ChannelInterface from './Interface/ChannelInterface';

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
  const handleClose = () => {
    setValues({
      channelId: 0,
      userId: 0,
      minutes: 0,
    })
    setOpen(false)
  }

  const banUser = () => {
    if (actualChannelInterface === undefined) {
      alert('Incomplete demand');
      return;
    }
    axios.post('http://localhost:3001/chat/banUser', {
      channelId: actualChannelInterface?.id,
      banedId: values.userId,
    }).then(res => res.data.length > 0 ? alert(res.data) : console.log('OK')).catch()
  }
  const blockUser = () => {
    axios.post('http://localhost:3001/chat/blockUser', {
      blockedUserId: values.userId,
    }).then(res => res.data.length > 0 ? alert(res.data) : console.log('OK')).catch()
  }
  const makeUserAdmin = () => {
    if (actualChannelInterface === undefined) {
      alert('Incomplete demand');
      return;
    }
    axios.post('http://localhost:3001/chat/makeUserAdmin', {
      channelId: actualChannelInterface?.id,
      newAdminId: values.userId,
    }).then(res => res.data.length > 0 ? alert(res.data) : console.log('OK')).catch()
  }
  const muteUser = () => {
    if (actualChannelInterface === undefined) {
      alert('Incomplete demand');
      return;
    }
    axios.post('http://localhost:3001/chat/muteUser', {
      channelId: actualChannelInterface?.id,
      muteId: values.userId,
      minutes: values.minutes,
    }).then(res => res.data.length > 0 ? alert(res.data) : console.log('OK')).catch()
  }

  const userList = actualChannelInterface?.users.map((c, i) => (
    <ListItem key={i} onClick={event => handleClickOpen(c.id)}>
      <div className='list'>{c.name}</div>
    </ListItem>
  ))


  return (
    <div className='ChannelList'>
      <div className='header'>
        <div className='title'>Channel users</div>
      </div>
      {userList}
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
              if (e.target.value >= 1000) {
                alert("max value is 1000");
                e.target.value = 1000;
              }
              setValues({ ...values, minutes: e.target.value })
            }}
          />
          <DialogActions>
            <button onClick={muteUser}>muteUser</button>
          </DialogActions>
          <DialogActions>
            <button onClick={handleClose}>Cancel</button>
          </DialogActions>
        </Dialog>
      </h2>
    </div >
  )
}
