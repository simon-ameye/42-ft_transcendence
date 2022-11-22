import { PropsWithChildren } from "react";
import Navbar from "../../components/Navbar";

const AuthenticatedLayout = (props: PropsWithChildren) => {
	return (
		<>
			<Navbar />
			<div className="authenticated-layuout">
				{props.children}
			</div>
		</>
	);
};

export default AuthenticatedLayout;