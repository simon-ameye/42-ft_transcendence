import React, { useState, useEffect } from 'react';
import { socket } from '../App';
import axios from 'axios';
import OppenentsInterface from '../interfaces/oppenents.interface';
import InvitPopup from './invit-popup.component';

export default function MatchingQueue() {

		// VARIABLES \\
	
	const	[matchingQueue, setMatchingQueue] = useState<string[]>([]);
	
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
	
		// USE_EFFECT \\
	
	 useEffect (() => {
	 axios.get('http://localhost:3001/game')
	 	.then(res => {
			setMatchingQueue(res.data);
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
			<InvitPopup />
		</>
	)
}
