import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import './App.css';
import MessageInput from './components/message-input.component';
import Messages from './components/messages.component';
import JoinGame from './components/join-game.component';
import MatchingQueue from './components/matching-queue.component';

function App() {
	const [socket, setSocket] = useState<Socket>()
	const [messages, setMessages] = useState<string[]>([])
	const [count, setCount] = useState(0);

	useEffect(() => {
		document.title = `${count}`;
	})

	const	send = (value: string) => {
		socket?.emit("message", value);
	}

	useEffect(() => {
		const newSocket = io('http://localhost:4343');
		setSocket(newSocket);
	}, [setSocket])

	const	messageListener = (message: string) => {
		setMessages([...messages, message]);
	}

	useEffect(() => {
		socket?.on("message", messageListener);
		return () => {
			socket?.off("message", messageListener);
		}
	})

	// COMPONENTS/MATCHING_QUEUE \\
	const	[matchingQueue, setMatchingQueue] = useState<string[]>([])

	const	addToQueue = () => {
		if (socket !== undefined && !matchingQueue.includes(socket.id)) {
			socket.emit("matchingQueue", socket.id);
		}
	}

	const matchingQueueListener = (socketId: string) => {
			setMatchingQueue([...matchingQueue, socketId]);
	}

	useEffect(() => {
		socket?.on("matchingQueue", matchingQueueListener);
		return () => {
			socket?.off("matchingQueue", matchingQueueListener);
		}
	})

	return (
		<>
			<div>
				<p>You clicked {count} times </p>
				<button onClick={() => setCount(count + 1)}>
					Click me
				</button>
			</div>
			{" "}
			<MessageInput send={send} />
			<Messages messages={messages} />
			<JoinGame addToQueue={addToQueue} />
			<MatchingQueue queue={matchingQueue} />
		</>
	)
}

export default App;
