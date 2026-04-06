import { getAccessToken } from "../utils/tokenService";

export const useAuth = () => {

    const token = getAccessToken();

    return {
        isAuthenticated: !!token
    };

};