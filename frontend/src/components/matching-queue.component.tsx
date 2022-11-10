import React, { useState } from 'react';

export default function MatchingQueue({queue}: {queue: string[]}) {
	return (
		<>
			<h5>Matching Queue</h5>
			<div>
				{queue.map((queue, index) => (
					<div key={index}> - {queue}</div>
				))}
			</div>
		</>
	)
}
