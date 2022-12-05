import { useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
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
  const handleVisibility = () => {
    setValues({
      ...values,
      showpass: !values.showpass,
    });
  };
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
      password: values.password,
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
              Enter your channel name, and optionally password
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
            <TextField
              type={values.showpass ? "text" : "password"}
              label="Password"
              placeholder="Password"
              variant="outlined"
              style={{
                padding: 10
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleVisibility}
                      aria-label="toggle password"
                      edge="end">
                      {values.showpass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onChange={(e: any) => {
                setValues({ ...values, password: e.target.value })
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