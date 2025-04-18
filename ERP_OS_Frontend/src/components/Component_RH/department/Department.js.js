import { Navigate } from "react-router-dom";
import PageTitle from "../../page-header/PageHeader";
import AddDepartment from "./AddDepartment";

const Department = (props) => {
	const isLogged = Boolean(localStorage.getItem("isLogged"));

	if (!isLogged) {
		return <Navigate to={"/auth/login"} replace={true} />;
	}
	return (
		<div>
			<PageTitle title='Retour' />
			<AddDepartment />
		</div>
	);
};

export default Department;
