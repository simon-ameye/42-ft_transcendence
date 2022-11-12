import React from 'react';
import '../styles/invit-popup.css';
import InvitPopupInterface from '../interfaces/invit-popup.interface';

export default function	InvitPopup(
		{trigger, removeInvitPopup, invitText} : InvitPopupInterface)
{
	return (trigger) ? (
		<div className="invitPopup">
			<div className="invitPopup-inner">
				<button className="close-btn" onClick={() => removeInvitPopup()}>close</button>
				<h3>{invitText}</h3>
			</div>
		</div>
	)	: <></>;
}
