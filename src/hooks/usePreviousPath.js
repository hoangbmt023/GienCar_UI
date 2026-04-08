import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

export const usePreviousPath = () => {
    const location = useLocation();
    const prevRef = useRef(location.pathname);

    useEffect(() => {
        sessionStorage.setItem("previousPath", prevRef.current);
        prevRef.current = location.pathname;
    }, [location]);
};