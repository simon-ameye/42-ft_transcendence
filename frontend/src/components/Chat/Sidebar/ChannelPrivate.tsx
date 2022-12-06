import { useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import { RiChatPrivateFill } from "react-icons/ri";
import axios from 'axios';

const ChannelPrivate = () => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    name: '',
    password: '',
    showpass: false
  })
  
  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setValues({
      name: '',
      password: '',
      showpass: false
    })
    setOpen(false)
  }

  const handleCreatePrivateChannel = () => {
    axios.post('http://localhost:3001/chat/createChannel', {
      name: values.name,
      mode: 'PRIVATE',
      password: "",
      otherUserId: '',
    }).then(res => alert(res.data)).catch(err => alert(err))
  }
  const handleSubmit = () => {
    handleClose()
    handleCreatePrivateChannel()
  }

  return (
    <div>
      <h2><RiChatPrivateFill size="30" className='button_create_channel_private' onClick={handleClickOpen} >
      </RiChatPrivateFill>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle><span style={{ color: 'black' }}>Create Private Channel</span></DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter your channel name
              <br></br>
            </DialogContentText>
            <TextField
              type="username"
              label="Enter channel name"
              placeholder="Name"
              variant="outlined"
              required
              style={{
                padding: 10
              }}
              inputProps={{ maxLength: 20 }}
              onChange={(e: any) => {
                setValues({ ...values, name: e.target.value })
              }}
            />
          </DialogContent>
          <DialogActions>
            <button onClick={handleClose}>Cancel</button>
            <button onClick={handleSubmit}>Create</button>
          </DialogActions>
        </Dialog>
      </h2>
    </div>
  )
}
export default ChannelPrivate;