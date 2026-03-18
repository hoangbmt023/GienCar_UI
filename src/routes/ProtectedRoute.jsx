import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../utils/tokenService";

const ProtectedRoute = () => {

    const token = getAccessToken();

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ fromProtected: true }}
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;