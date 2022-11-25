import {ListItem} from '@mui/material'
import ChannelInterface from '../ChannelInterface';
import { IoIosAdd } from "react-icons/io";
import axios from 'axios';

export default function PublicList () {
//  const [channelNames, setchannelNames] = useState<string[]>([])
//
//  function getPublicChannelTable() {
//    alert('You clicked me!');
//    axios.get('http://localhost:3001/chat/getPublicChannelTable',{
//    }).then(
//      setchannelNames(response.names)
//      //res => console.log(res)).catch(err => console.log(err)
//      )
//  }

  return (
    <div className='PublicList'>
    </div>
  )
}

//<button onClick={getPublicChannelTable}>get Channels</button>
//{channelInterfaces && channelInterfaces.map((c) => {
//  return <h3>{c.name}</h3>
//})}