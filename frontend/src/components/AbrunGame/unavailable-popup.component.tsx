import React, { useState, useEffect } from 'react';
import './style.scss';
import { socket } from '../../App';
import { useNavigate } from 'react-router-dom';

export default function UnavailablePopup() {

	// VARIABLES \\

	const navigate = useNavigate();
	const [popup, setPopup] = useState<boolean>(false);
	const [unavailableText, setUnavailableText] = useState<string>("");

	// FUNCTIONS \\

	const removeInvitPopup = () => {
		setPopup(false);
	}

	// USE_EFFECT \\

	useEffect(() => {
		socket.on("user unavailable", popupListener);
		return () => {
			socket.off("user unavailable", popupListener);
		}
	})

	// LISTENER \\

	const popupListener = (unavailableDName: string) => {
		console.log('POPUP')
		setUnavailableText("Sorry but the player ".concat(unavailableDName) + " is no more available");
		setPopup(true);
	}

	// RETURN \\

	return (popup) ? (
		<div className="popupPopup">
			<div className='Title_popup'><span style={{ color: 'White' }}>{unavailableText}</span>
				<br></br>
		</div>
	</div>
	) : <></>;
}
