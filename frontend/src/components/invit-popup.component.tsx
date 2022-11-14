import React from 'react';
import '../styles/invit-popup.style.css';
import InvitPopupInterface from '../interfaces/invit-popup.interface';

export default function	InvitPopup(
		{trigger, removeInvitPopup, invitText, acceptInvit} : InvitPopupInterface)
{
	return (trigger) ? (
		<div className="invitPopup">
			<h3>{invitText}</h3>
			<div className="invitPopup-inner">
				<button className="close-btn" onClick={() => removeInvitPopup()}>close</button>
			</div>
			<button onClick={() => acceptInvit()}>accept</button>
		</div>
	)	: <></>;
}
