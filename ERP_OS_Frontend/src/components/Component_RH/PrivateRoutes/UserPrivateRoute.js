import { Navigate, Outlet } from "react-router-dom";
import getPermissions from "../../utils/getPermissions";
import Page404 from "../404/404Page";
import { toast } from "react-toastify";

const UserPrivateRoute = ({ path, permission, ...props }) => {
	const permissions = getPermissions();

	if (permissions?.includes(permission)) {
		return <Outlet />;
	} else {
		return <> {toast.error("Vous n'êtes pas autorisé, contactez l'administrateur")}</>;
	}
};

export default UserPrivateRoute;
