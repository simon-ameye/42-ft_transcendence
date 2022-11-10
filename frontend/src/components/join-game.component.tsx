import React from 'react';

export default function JoinGame(
	{addToQueue}: {addToQueue: () => void})
{
	return (
		<>
			<button onClick={() => addToQueue()}>Join game</button>
		</>
	)
}
