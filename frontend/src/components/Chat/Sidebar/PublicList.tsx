import { ListItem } from '@mui/material'
import ChannelsInterface from '../Interface/ChannelsInterface';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, InputAdornment, IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { TbKey, TbKeyOff, TbRefresh } from 'react-icons/tb';
import { useEffect, useState } from "react";

export default function PublicList() {

  const [channelsInterfaces, setchannelsInterfaces] = useState<ChannelsInterface[]>([])
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    channelId: 0,
    name: '',
    password: '',
    showpass: false
  })
  const handleClickOpen = (channelId: number) => {
    setValues({ ...values, channelId: channelId });
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
      channelId: 0,
      name: '',
      password: '',
      showpass: false
    })
    setOpen(false)
  }
  const handleJoinChannel = () => {
    axios.post('http://localhost:3001/chat/joinChannel', {
      channelId: values.channelId,
      password: values.password,
    }).then(res => alert(res.data)).catch(err => alert(err))
  }
  const handleSubmit = () => {
    handleClose()
    handleJoinChannel()
  }

  function getPublicChannelTable() {
    axios.get('http://localhost:3001/chat/getPublicChannelTable', {
    }).then(
      function (response) {
        setchannelsInterfaces(response.data.channelsInterfaces);
      }
    )
  }

  const channelList = channelsInterfaces.map((c, i) => (
    <ListItem key={i} onClick={event => handleClickOpen(c.id)} >{c.isProtected ? <TbKey /> : <TbKeyOff />}
      <div className='list'>{c.name}</div>
    </ListItem>
  ))

  useEffect(() => {
    getPublicChannelTable()
  }, [])

  return (
    <div className='ChannelList'>
      <div className='header'>
        <div className='title'>Public channels</div>
        <TbRefresh className='refreshButton' onClick={getPublicChannelTable}></TbRefresh>
      </div>
      {channelList}
      <h2>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle><span style={{ color: 'black' }}>Join Channel</span></DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter channel password
            </DialogContentText>
            <TextField
              type={values.showpass ? "text" : "password"}
              fullWidth
              label="Password"
              placeholder="Password"
              variant="outlined"
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
                setValues({ ...values, password: e.target.value })
              }}
            />
          </DialogContent>
          <DialogActions>
            <button onClick={handleClose}>Cancel</button>
            <button onClick={handleSubmit}>Join</button>
          </DialogActions>
        </Dialog>
      </h2>
    </div>
  )
}
