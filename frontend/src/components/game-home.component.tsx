import React, { useState, useEffect } from 'react';
import { socket } from '../App';
import axios from 'axios';
import OppenentsInterface from '../interfaces/oppenents.interface';
import PlayerInterface from '../interfaces/player.interface';
import InvitPopup from './invit-popup.component';
import { useNavigate } from 'react-router-dom';

export default function GameHome() {

		// VARIABLES \\
	
	const navigate = useNavigate();
	const	[matchingQueue, setMatchingQueue] = useState<string[]>([]);
	const [gameList, setGameList] = useState<string[]>([]);
	
		// FUNCTIONS \\
	
	const	addToQueue = () => {
		if (!matchingQueue.includes(socket.id)) {
			socket.emit("matchingQueue");
		}
	}

	const sendInvit = (receiverId: string) => {
		if (socket.id !== receiverId)
			socket.emit("invitation", receiverId);
	}

	const watchMatch = (strGame: string) => {
		const playerIds = strGame.split(" ");
		playerIds.splice(1, 1);
		navigate('/live');
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
		socket.on("matchingQueue", matchingQueueListener);
		return () => {
			socket.off("matchingQueue", matchingQueueListener);
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
	
	const matchingQueueListener = (socketId: string) => {
			setMatchingQueue([...matchingQueue, socketId]);
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
		let strGame = players[0].socketId.concat(" vs ");
		strGame = strGame.concat(players[1].socketId);
		setGameList([...gameList, strGame]);
	}

		// RETURN \\

	return (
		<>
			<div>
				<button onClick={() => addToQueue()}>Join game</button>
			</div>
			<div>
				<h5>Matching Queue</h5>
				<ul>
					{matchingQueue.map((matchingQueue, index) => (
						<li key={index}>{matchingQueue}     <button 
								onClick={() => sendInvit(matchingQueue)}>Invit</button>
						</li>
					))}
				</ul>
			</div>
			<div>
				<h5>Game in progress</h5>
				<ul>
					{gameList.map((gameList, index) => (
						<li key={index}>{gameList}      <button 
								onClick={() => watchMatch(gameList)}>Watch</button>
						</li>
					))}
				</ul>
			</div>
			<InvitPopup />
		</>
	)
}
