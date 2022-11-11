import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function	InitMatchingQueue() {
	const	[queue, setQueue] = useState([]);

	useEffect(() => {
		axios.get('http://localhost:3001/game')
			.then(res => {
				console.log(res);
				setQueue(res.data);
			})
			.catch(err => {
				console.log(err);
			})
	}, []);

	return (
		<div>
			<ul>
				{queue.map((queue, index) => (
				 <li key={index}>{queue}</li>
				 ))}
			</ul>
		</div>
	)
}
