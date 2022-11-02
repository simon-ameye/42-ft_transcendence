import React from 'react';
import { useState } from 'react';
import './RegisterPage.css'
import {
    makeStyles,
    InputBase,
} from "@material-ui/core";

import Big_Avatar from '../Avatar/Avatar';
import Navbar from '../Navbar/Navbar';

const useStyles = makeStyles(theme => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
            width: "25ch",
            align: 'center',
            textAlign: 'center',

        }
    },
    InputBase: {
        border: "1px solid green",
        borderRadius: theme.shape.borderRadius,
        height: "4vh",
        padding: theme.spacing(2),
    }
}));

export const RegisterPage: React.FC = () => {
    const classes = useStyles();
    const [password, setPassword] = useState('');
    return (
        <div className="register-container">
            <Navbar />
            <h2><span style={{ color: "green" }}>New</span>users</h2>
            <h3><Big_Avatar></Big_Avatar>
                <form id="login-form" className={classes.root} >
                    <InputBase
                        className={classes.InputBase}
                        inputProps={{ style: { color: "white" } }}
                        type='username'
                        placeholder="Username"
                        color='primary'
                    />
                    <div style={{ margin: 0 }} />
                    <InputBase
                        className={classes.InputBase}
                        inputProps={{ style: { color: "white" } }}
                        type='Full name'
                        placeholder="Fullname"
                        color='primary' />
                    <div style={{ margin: 0 }} />
                    <InputBase
                        className={classes.InputBase}
                        inputProps={{ style: { color: "white" } }}
                        type='Email'
                        placeholder="Email"
                        color='primary' />
                    <div style={{ margin: 0 }} />
                    <InputBase
                        className={classes.InputBase}
                        required
                        placeholder="Password"
                        color='primary'
                        name="password"
                        type="password"
                        value={password}
                        inputProps={{ style: { color: "white" } }}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }} />
                    <div style={{ margin: 0 }} />
                    <InputBase
                        className={classes.InputBase}
                        inputProps={{ style: { color: "white" } }}
                        type='password'
                        placeholder="Repeat password"
                        name='confirmationpassword'
                        color='primary' />
                    <button><span>Create new account </span></button>

                </form>
            </h3>
        </div>

    )
}

export default RegisterPage;
