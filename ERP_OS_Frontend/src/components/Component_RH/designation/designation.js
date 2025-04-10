import { Navigate } from "react-router-dom";
import PageTitle from "../../page-header/PageHeader";
import AddDesignation from "./addDesignation";
import GetAllDesignation from "./getAllDesignation";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";

const Designation = (props) => {
	const isLogged = Boolean(localStorage.getItem("isLogged"));

	if (!isLogged) {
		return <Navigate to={"/admin/auth/login"} replace={true} />;
	}

	return (
		<div>
			<PageTitle title='Retour' />
			<UserPrivateComponent permission={"createDesignation"}>
				<AddDesignation />
			</UserPrivateComponent>

			<UserPrivateComponent permission={"viewDesignation"}>
				<GetAllDesignation />
			</UserPrivateComponent>
		</div>
	);
};

export default Designation;
