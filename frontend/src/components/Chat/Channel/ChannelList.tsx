import { ListItem } from '@mui/material'
import ChannelInterface from '../ChannelInterface';
import axios from 'axios';


export default function ChannelList({ channelInterfaces }: { channelInterfaces: ChannelInterface[] }) {

  function sendAllChannelInterfaces() {
    axios.get('http://localhost:3001/chat/sendAllChannelInterfaces', {
    }).then(res => console.log(res)).catch(err => console.log(err))
  }

  return (
    <div className='ChannelList'>
      <button onClick={sendAllChannelInterfaces}>Refresh Channels</button>

      {channelInterfaces && channelInterfaces.map((c) => {
        return <h3>{c.name}</h3>
      })}
    </div>
  )
}