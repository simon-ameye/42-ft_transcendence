import React, { useState, useEffect } from 'react';
import '../../styles/invit-popup.style.css';
import { socket } from '../../App';
import { useNavigate } from 'react-router-dom';

export default function	InvitPopup() {

	// VARIABLES \\

	const navigate = useNavigate();
	const [invit, setInvit] = useState<boolean>(false);
	const [invitText, setInvitText] = useState<string>("");

	// FUNCTIONS \\
	
	const removeInvitPopup = () => {
		setInvit(false);
	}

	const acceptInvit = () => {
		const invitTextArray = invitText.split(" ");
		const	senderId = invitTextArray[invitTextArray.length - 1];
		socket.emit("invitation accepted", senderId);
		navigate('/game/live');
		setInvit(false);
	}

	// USE_EFFECT \\

	useEffect(() => {
		socket.on("send invitation", invitListener);
		return () => {
			socket.off("send invitation", invitListener);
		}
	})

	useEffect(() => {
		socket.on("invitation accepted sender",
				invitAcceptedSenderListener);
		return () => {
			socket.off("invitation accepted sender",
					invitAcceptedSenderListener);
		}
	});

	// LISTENER \\

	const invitListener = (senderName: string) => {
		setInvitText("You receive an invitation to pong game from ".concat(senderName));
		setInvit(true);
	}

	const	invitAcceptedSenderListener = (gameRoom: string) => {
		socket.emit("invitation accepted sender", gameRoom);
		navigate('/game/live');
	}

	// RETURN \\

	return (invit) ? (
		<div className="invitPopup">
			<h3>{invitText}</h3>
			<div className="invitPopup-inner">
				<button className="close-btn" onClick={() => removeInvitPopup()}>close</button>
			</div>
			<button onClick={() => acceptInvit()}>accept</button>
		</div>
	)	: <></>;
}
