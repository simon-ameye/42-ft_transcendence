import React, { useState, useEffect } from 'react';
import './style.scss';
import { socket } from '../../App';
import { useNavigate } from 'react-router-dom';

export default function InvitPopup() {

	// VARIABLES \\

	const navigate = useNavigate();
	const [invit, setInvit] = useState<boolean>(false);
	const [invitText, setInvitText] = useState<string>("");
	const [open, setOpen] = useState(false);


	const handleClose = () => {
		setOpen(false)
	}


	// FUNCTIONS \\

	const removeInvitPopup = () => {
		setInvit(false);
	}

	const acceptInvit = () => {
		const invitTextArray = invitText.split(" ");
		const senderDName = invitTextArray[invitTextArray.length - 1];
		socket.emit("invitation accepted", senderDName);
		navigate('/game');
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

	const invitAcceptedSenderListener = (gameRoom: string) => {
		socket.emit("invitation accepted sender", gameRoom);
		navigate('/game/live');
	}

	// RETURN \\

	return (invit) ? (
		<div className="invitPopup">
			<div className='Title_popup'><span style={{ color: 'black' }}>{invitText}</span>
				<br></br>
				<div className="btn" >
				<button className="btn_accept" onClick={() => acceptInvit()}>Accept</button>
				<button className="btn_close" onClick={() => removeInvitPopup()}>Close</button>
				</div>
		</div>
	</div>
	) : <></>;
}
