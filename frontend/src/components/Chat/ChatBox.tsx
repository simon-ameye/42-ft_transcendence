import { ContactlessOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { socket } from '../../App';
import Navbar from '../Navbar';
import ChannelList from './Channel/ChannelList';
import ChannelInterface from './ChannelInterface';
import Chat from './Chat';
import Sidebar from './Sidebar';

const Chatbox = () =>
{
    const [channelInterfaces, setchannelInterfaces] = useState<ChannelInterface[]>([])


    const messageListener = (channelInterface: ChannelInterface) => {
        //store channel in channel list (replace ?)
        //put channel names in channel table

        //console.log(channelInterface.id)
        //console.log(channelInterface.name)
        //console.log(channelInterface.mode)
        //console.log(channelInterface.messages)
        //console.log(channelInterface.authors)
        //console.log(channelInterface.dates)
        //console.log(channelInterface.isProtected)

        channelInterfaces.push(channelInterface)
        console.log("voisi la channel interfaceS")
        console.log(channelInterfaces)
        //afficher la userChannelTable
      }
    
      useEffect(() => {
        socket.on('channelInterface', messageListener)
        return () => {
        }
      })
    return (
    <div>
        <Navbar/>
            <div className='chatbox'>
                <div className='chatbox-container'>
                    <Sidebar />
                    <Chat/>
            </div>
        </div>
    </div>
    )
}

export default Chatbox;