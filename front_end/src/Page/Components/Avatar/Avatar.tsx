import React from 'react'
import { Avatar } from '@material-ui/core';
import './Avatar.css';
import {
    makeStyles,

} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center"
    },
    avatar:
    {
        color: 'green',
        margin: 10,
        width: 120,
        height: 120,
    }

}));


export const Big_Avatar: React.FC = () => {
    const classes = useStyles();
    return (
        <div className='Avatar-container'>
            <h1> Select a image
                <div className={classes.root}>
                    <Avatar className={classes.avatar}></Avatar>
                </div>

            </h1>
        </div>
    );
}
export default Big_Avatar;
