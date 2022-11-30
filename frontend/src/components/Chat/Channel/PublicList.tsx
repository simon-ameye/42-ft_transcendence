import {ListItem} from '@mui/material'
import ChannelInterface from '../ChannelInterface';
import ChannelsInterface from '../ChannelsInterface';
import { IoIosAdd } from "react-icons/io";
import axios from 'axios';
import React, { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';

export default function PublicList () {

  //const [channelIds, setids] = useState<number[]>([])
  //const [channelNames, setchannelNames] = useState<string[]>([])
  //const [channelIsPrivates, setchannelIsPrivates] = useState<boolean[]>([])
  const [channelsInterfaces, setchannelsInterfaces] = useState<ChannelsInterface[]>([])

  function getPublicChannelTable() {
    axios.get('http://localhost:3001/chat/getPublicChannelTable',{
    }).then(
      function (response) {
        console.log(response.data.channelsInterfaces);
        console.log(response.data.channelsInterfaces.length);
        //setchannelNames(response.data.names);}
        setchannelsInterfaces(response.data.channelsInterfaces);
        console.log(channelsInterfaces.length);
      }
      )
  }


  const joinPublicChannel = () => (
    <div>yooo</div>











































  )

  const channelList = channelsInterfaces.map((c , i) => (
      <ListItem button key={i} onClick={joinPublicChannel} >{c.isProtected ? <div>P-</div> : <div>N-</div>} {c.name}



























      </ListItem>
    ))


  return (
    <div className='PublicList'>
      <button onClick={getPublicChannelTable}>refresh public channels</button>
      <div>
        {channelList}
      </div>
    </div>
  )
}
