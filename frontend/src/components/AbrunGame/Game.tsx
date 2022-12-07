import React, { useState, useEffect } from 'react';
import { socket } from '../../App';
import axios from 'axios';
import OppenentsInterface from '../../interfaces/oppenents.interface';
import PlayerInterface from '../../interfaces/player.interface';
import InvitPopup from './invit-popup.component';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Navbar from '../Navbar';
import { ListItem } from '@mui/material';

export default function GameHome() {

		// VARIABLES \\
	
	const [cookie] = useCookies(['displayName']);
	const navigate = useNavigate();
	const	[matchingQueue, setMatchingQueue] = useState<string[]>([]);
	const [gameList, setGameList] = useState<string[]>([]);
	
		// FUNCTIONS \\
	
	const	addToQueue = () => {
		if (!matchingQueue.includes(cookie.displayName)) {
			socket.emit("join matching queue");
		}
	}

	const sendInvit = (receiverId: string) => {
		if (socket.id !== receiverId)
			socket.emit("invitation", receiverId);
	}

	const watchMatch = (strGame: string) => {
		const playerIds = strGame.split(" ");
		playerIds.splice(1, 1);
		navigate('/game/live');
		socket.emit("watch game", playerIds);
	}
	
		// USE_EFFECT \\
	
	 useEffect (() => {
	 axios.get('http://localhost:3001/game/queue')
	 	.then(res => {
			setMatchingQueue(res.data);
	 	})
	 	.catch(err => {
	 		console.log(err);
	 	})
	}, []);
	
	 useEffect (() => {
	 axios.get('http://localhost:3001/game/list')
	 	.then(res => {
			setGameList(res.data);
	 	})
	 	.catch(err => {
	 		console.log(err);
	 	})
	}, []);
	

	useEffect(() => {
		socket.on("join matching queue", joinMatchingQueueListener);
		return () => {
			socket.off("join matching queue", joinMatchingQueueListener);
		}
	})

	useEffect(() => {
		socket.on("deleteOppenents", deleteOppenentsListener);
		return () => {
			socket.off("deleteOppenents", deleteOppenentsListener);
		}
	})

	useEffect(() => {
		socket.on("update game list", updateGameListListener);
		return () => {
			socket.off("update game list", updateGameListListener);
		}
	})

		// LISTENER \\
	
	const	joinMatchingQueueListener = (displayName: string) => {
			setMatchingQueue([...matchingQueue, displayName]);
	}

	const deleteOppenentsListener = (oppenents: OppenentsInterface) => {
		let index = matchingQueue.indexOf(oppenents.one);
		if (index >= 0)
			matchingQueue.splice(index, 1);
		index = matchingQueue.indexOf(oppenents.two);
		if (index >= 0)
			matchingQueue.splice(index, 1);
		setMatchingQueue([...matchingQueue]);
	}

	const updateGameListListener = (players: PlayerInterface[]) => {
		let strGame = players[0].displayName.concat(" vs ");
		strGame = strGame.concat(players[1].displayName);
		setGameList([...gameList, strGame]);
	}

	function MissedGoal() {
 	 return <h1>MISSED!</h1>;
	}

	const MatchingQueue = matchingQueue.map((matchingQueue, index) => (
		<ListItem button key={index}>{matchingQueue}
			{cookie.displayName && matchingQueue !== cookie.displayName && <button onClick={() => sendInvit(matchingQueue)}><span style={{ color: 'black' }}>Invit</span></button>}
		</ListItem>
	))

	const GameInProgress = gameList.map((gameList, index) => (
		<ListItem button onClick={() => watchMatch(gameList)} key={index}>{gameList} </ListItem>
	))
	

		// RETURN \\

	return (
		<div>
			<Navbar/>
				<div className='Join_game'>
					{/* Left Side*/}
					<div className='leftside_game'>
						<div className='game-container'>
							<br></br>
								{cookie.displayName}
							<br></br>
								<div className='Join_game_button'>
									<br></br>
									{cookie.displayName &&
									<div>
										<button  onClick={() => addToQueue()}><span style={{color: 'black'}}>Join game</span></button>
									</div>}
								</div>
								<div className='Matching_queue'>
									<br></br>Matching Queue
									{MatchingQueue }
								</div>
							<div>
								<br></br>
								<h5>Watch game in progress</h5>
										{GameInProgress}
							</div>
						</div>
					</div>
				</div>
			<InvitPopup />
		</div>
	)
}
