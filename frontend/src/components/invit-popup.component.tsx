import React from 'react';
import '../styles/invit-popup.css';

export default function	InvitPopup(
		{trigger} : {trigger: boolean})
{
	return (trigger) ? (
		<div className="invitPopup">
			<div className="invitPopup-inner">
				<button className="close-btn">close</button>
				<h1>Invitation</h1>
			</div>
		</div>
	)	: <></>;
}
