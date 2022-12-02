import { useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  IconButton,
  Button
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import axios from 'axios';
import { AiFillSetting } from 'react-icons/ai';
import ChannelInterface from './ChannelInterface'


const ChannelSetting = ({ actualChannelInterface }: { actualChannelInterface: ChannelInterface | undefined }) => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    newpassword: '',
    showpass:false
  })

  const handleClickOpen = () => {
    if (actualChannelInterface)
      setOpen(true);
  }

  const handleVisibility = () => {
    setValues({
      ...values,
      showpass: !values.showpass,
    });
  };
  const handleClickSetting = async () => {
    if (actualChannelInterface)
      axios.post('http://localhost:3001/chat/leaveChannel', {
        channelId: actualChannelInterface.id,
      }).then(res => console.log(res)).catch(err => console.log(err))
    handleClose();
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleNewpass = () => {
    if (actualChannelInterface)
    axios.post('http://localhost:3001/chat/setChannelPassword', {
      channelId: actualChannelInterface.id,
      newPassword: values.newpassword,
    }).then(res => console.log(res)).catch(err => console.log(err))
  }

  const handleSubmit = () => {
    handleClose()
    handleNewpass()
  }

return (
  <div className="channel_setting" >
    <AiFillSetting size="30" onClick={handleClickOpen}></AiFillSetting>
    <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Channel Setting</DialogTitle>
    <DialogContent>
      <Button onClick={handleClickSetting}>Leave Channel</Button>
        <DialogContentText>
          <br></br>
          Change password
        </DialogContentText>
      <TextField
        type={values.showpass ? "text" : "password"}
        fullWidth
        label="Newpass"
        placeholder='Newpass'
        variant='outlined'
        style={{
          padding: 5
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
            setValues({ ...values, newpassword: e.target.value })
          }}
      ></TextField>
    </DialogContent>
    <DialogActions>
        <button onClick={handleSubmit}>New password</button>
        <button onClick={handleClose}>Cancel</button>
    </DialogActions>
  </Dialog>
  </div>
)
}
export default ChannelSetting;