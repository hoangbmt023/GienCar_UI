const env = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    FE_URL: import.meta.env.VITE_FE_URL || 'http://localhost:5173',
};

export default env;