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
import axios from 'axios';
import { AiFillWechat } from 'react-icons/ai';

const Channel = () => {
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

  const handleCreateChannel = () => {
    axios.post('http://localhost:3001/chat/createChannel', {
      name: values.name,
      mode: 'PUBLIC',
      password: values.password,
      otherUserId: '',
    }).then(res => alert(res.data)).catch(err => alert(err))
  }
  const handleSubmit = () => {
    handleClose()
    handleCreateChannel()
  }

  return (
    <div className='buttonl'>
      <AiFillWechat size="30" onClick={handleClickOpen} >
      </AiFillWechat>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle><span style={{ color: 'black' }}>Create Public Channel</span></DialogTitle>
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
    </div>
  )
}
export default Channel;