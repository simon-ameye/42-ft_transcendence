import React from 'react'
import Navbar from '../Navbar';
import Chat from './Chat';
import Sidebar from './Sidebar';



const Chatbox = () =>
{
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