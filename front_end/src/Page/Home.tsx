import './Home.css';
import './logo/J8ND.gif';
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    makeStyles,
    InputBase,
} from "@material-ui/core";


const useStyles = makeStyles(theme => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
            width: "33ch",
        }
    },
    InputBase: {
        border: "1px solid green",
        borderRadius: theme.shape.borderRadius,
        height: "4vh",
        padding: theme.spacing(2),
    }
}));

export const Home: React.FC = () => {
    const classes = useStyles();
    const [password, setPassword] = useState('');
    return (
        <div className="home-container" >
            <h1><span style={{ color: "green" }}>PONG</span>AME</h1>
            <p><span style={{ color: "green" }}>Pong</span> is one of the first computer games that ever created, this
                simple tennis like game features two paddles and a ball. The game
                was originally developed by Allan Alcorn and released in 1972 by
                Atari corporations. Soon, Pong became a huge success that is
                considered to be the game which started the video games industry.
                <br />
                <span style={{ color: "green" }}>source: ponggame.org</span>
            </p>
            <h2><img src={require('./logo/J8ND.gif')} alt="home" /></h2>
            <div className="login-container">
                <button> Login with 42 </button>
                <div className="login-container__separator">
                    <h3>Or</h3>
                    <form id="login-form" className={classes.root}>
                        <InputBase
                            className={classes.InputBase}
                            inputProps={{ style: { color: "white" } }}
                            type='username'
                            placeholder="username"
                            color='primary'
                        />
                        <div style={{ margin: 0 }} />
                        <InputBase
                            className={classes.InputBase}
                            required
                            placeholder="password"
                            color='primary'
                            name="password"
                            type="password"
                            value={password}
                            inputProps={{ style: { color: "white" } }}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                        <div style={{ margin: 5 }} />
                    </form>
                    <button form="login-form">Login</button>
                    <div className="final-text"></div>
                    <p> <span style={{ color: "white" }}>No account? </span>
                        <Link style={{ color: "green" }} to="RegisterPage">Create one</Link>
                    </p>
                </div>
            </div >
        </div>
    )
}
export default Home