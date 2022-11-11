import React from 'react';

export default function MatchingQueue(
		{queue}: {queue: string[]},
		{sendInvit}: {sendInvit: () => void})
{
	return (
		<>
			<h5>Matching Queue</h5>
			<ul>
				{queue.map((queue, index) => (
					<li key={index}>{queue}     <button 
							onClick={(queue) => sendInvit()}>Invit</button>
					</li>
				))}
			</ul>
		</>
	)
}
