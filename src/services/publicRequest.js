import axios from "axios";

const publicRequest = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export default publicRequest;