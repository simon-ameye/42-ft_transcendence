import React from 'react';

export default function MatchingQueue({queue}: {queue: string[]}) {
	return (
		<>
			<h5>Matching Queue</h5>
			<ul>
				{queue.map((queue, index) => (
					<li key={index}> - {queue}</li>
				))}
			</ul>
		</>
	)
}
