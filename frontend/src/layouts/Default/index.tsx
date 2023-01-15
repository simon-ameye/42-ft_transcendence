import { PropsWithChildren } from "react";
import { useCookies } from "react-cookie";
import Navbar from "../../components/Navbar";
import LoginNavbar from "../LoginNavbar";
import './style.scss'

const Default = (props: PropsWithChildren) => {
	const [cookie] = useCookies(['displayName', 'jwtToken']);

	return (
		<>
			{cookie.displayName ? <Navbar /> : <LoginNavbar />}
			<div className="default">
				{props.children}
			</div>
		</>
	);
};

export default Default;