const env = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    FE_URL: import.meta.env.VITE_FE_URL || 'http://localhost:5173',
    BE_URL: import.meta.env.VITE_BE_URL || 'http://localhost:3000',
};

export default env;