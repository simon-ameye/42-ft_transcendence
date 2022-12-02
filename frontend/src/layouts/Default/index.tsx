import { PropsWithChildren } from "react";
import Navbar from "../../components/Navbar";
import './style.scss'

const Default = (props: PropsWithChildren) => {
	return (
		<>
			<Navbar />
			<div className="default">
				{props.children}
			</div>
		</>
	);
};

export default Default;