import { useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from "@mui/material/TextField"

import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import axios from "axios"

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState({
        name:'',
        password: '',
        showpass: false
    })
    const handleClickOpen = () =>{
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

  //  POST : {name: 'my channel', mode: 'PUBLIC', password: 'my password', otherUserId: ''}
  const handleCreateChannel = () => {
    axios.post('http://localhost:3001/chat/createChannel',{
      name: values.name,
      mode: 'PUBLIC',
      password: values.password,
      otherUserId: '',
    }).then(res => console.log(res)).catch(err => console.log(err))
  }

    const handleSubmit = () => {
		  handleClose()
      handleCreateChannel()
	}
    return (
        <div className='Sidebar'> sidebar
        <h2><button className='button_create_channel' onClick={handleClickOpen} >
            New Channel
        </button>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create Channel</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Enter your channel name, and optionally password
				</DialogContentText>
                <TextField
                    type="username"
                    fullWidth
				    label="Enter channel name"
				    placeholder="Name"
				    variant="outlined"
					required
					style={{
						padding: 5
					    }}
                    onChange={(e:any) => {
                     setValues({...values, name: e.target.value})
                    }}
                />
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
					onChange={(e:any) => {
						setValues({...values, password: e.target.value})
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
export default Sidebar;