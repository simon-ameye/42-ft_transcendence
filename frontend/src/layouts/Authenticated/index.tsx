import { PropsWithChildren } from "react";
import Navbar from "../../components/Navbar";
import './style.scss'

const AuthenticatedLayout = (props: PropsWithChildren) => {
	return (
		<>
			<Navbar />
			<div className="authenticated-layout">
				{props.children}
			</div>
		</>
	);
};

export default AuthenticatedLayout;