import Navbar from '../Navbar';
import { ReactNode, useEffect, useState } from "react";
import axios from 'axios';
import ProfileInterface from './Interface/ProfileInterface';
import './style.scss'
import FileUpload from './upload';
import User from '../User';
import { ListItem } from '@mui/material';
import Default from '../../layouts/Default';
import { profile } from 'console';
import { useCookies } from 'react-cookie';

type User = {
  email: string;
  displayName: string;
  imageUrl: string;
  id: number;
  socketId: string;
  matchHistory: string[];
}

const Profile = () => {
  const [profileInterface, setprofileInterface] = useState<ProfileInterface | undefined>()
  const [friends, setFriends] = useState<User[]>([])
	const [cookie] = useCookies(['qrcode', 'displayName']);
	const [dfa, setDfa] = useState<string>('');
	const [displayqrcode, setDisplayqrcode] = useState<boolean>(false);
	const [displayqrcodeMessage, setDisplayqrcodeMessage] = useState<string>("Display QR Code");

  const friendList = friends.map((c, i) => (
    // add a link to each friend profile
    <ListItem key={i}>
      {c.displayName}
    </ListItem >
  ))
  
  const matchHistory = profileInterface?.matchHistory.map((c, i) => (
    // add a link to each friend profile
    <ListItem key={i}>
      { profileInterface?.displayName } VS { c.opponent } Score: {c.score[0]} {c.score[1]} on { c.date }
    </ListItem>
  ))

	const activate2fa = () => {
		axios.post('http://localhost:3001/auth/google2FA/activate')
			.then(res => window.location.reload())
			.catch(err => console.log(err))
	}

	const desactivate2fa = () => {
		axios.post('http://localhost:3001/auth/google2FA/desactivate')
			.then(res => window.location.reload())
			.catch(err => console.log(err))
	}

	const	displayQrcode = () => {
		setDisplayqrcode(!displayqrcode);
		if (!displayqrcode)
			setDisplayqrcodeMessage("Hide QR Code");
		else
			setDisplayqrcodeMessage("Display QR Code");
	}

  useEffect(() => {
    axios.get('http://localhost:3001/profile/myProfile', {
    }).then(
      function (response) {
        setprofileInterface(response.data);
      }).catch(err => console.log(err));
  }, [])

	useEffect(() => {
		if (cookie.displayName) {
			axios.get('http://localhost:3001/user/get2fa', {
				params: {
					displayName: cookie.displayName,
				}
			})
			.then(res => setDfa(res.data))
			.catch(err => console.log(err))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

  useEffect(() => {
    axios.get('http://localhost:3001/user/friendsList')
      .then(res => {
        setFriends(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  return (
    <Default>
      <div className='profile'>
        <div className='imageDiv'>
          <img className='profileImage' src="http://localhost:3001/profile/getImage" alt='profileImage'
          width="300" height="300"
          ></img>
        </div>
        <div className='displayName'>{profileInterface?.displayName} </div>
        <FileUpload/>
        <div className='friendList'>
          <h3>friends</h3>
          {friendList}
        </div>
        <div>level: {profileInterface?.victories} </div>
        <div className='matchHistory'>
          <h2> Match History </h2>
          { matchHistory }
        </div>
      </div>
			<div>
				{dfa === 'no' &&
				<button
					onClick={activate2fa} className='submit=btn'>Activate google 2FA authentificator
				</button>}
				{dfa === 'yes' &&
				<button
					onClick={desactivate2fa} className='submit=btn'>Desactivate google 2FA authentificator
				</button>}
			</div>
			<div>
				{cookie.qrcode &&
				<button onClick={displayQrcode} className='submit-btn'>{displayqrcodeMessage}</button>}
				{displayqrcode && <img src={cookie.qrcode} alt="qrcode" style={{ width: '400px' }}></img>}
			</div>
    </Default>
  )
}

export default Profile;
