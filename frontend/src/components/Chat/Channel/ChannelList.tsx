import React, { useState } from 'react';
import {List, ListItem} from '@mui/material'
import ChannelInterface from '../ChannelInterface';

const ChannelList = () =>{


return (
 
  <div>
    {[1, 2, 3].map((value)=> (
      <ListItem>
        key={value}
      </ListItem>
    ))}
  </div>
  )

}

export default ChannelList;