import React from 'react';
import MatchingQueueInterface from '../interfaces/matching-queue.interface';

export default function MatchingQueue(
		{queue, sendInvit}: MatchingQueueInterface)
{
	return (
		<>
			<h5>Matching Queue</h5>
			<ul>
				{queue.map((queue, index) => (
					<li key={index}>{queue}     <button 
							onClick={() => sendInvit(queue)}>Invit</button>
					</li>
				))}
			</ul>
		</>
	)
}
