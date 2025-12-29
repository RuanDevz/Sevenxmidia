/**
 * Configuração da API
 * Centraliza as URLs e configurações de chamadas à API
 */

const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001',
    TIMEOUT: 30000,
    
    ENDPOINTS: {
        AUTH: {
            REGISTER: '/auth/register',
            LOGIN: '/auth/login',
            LOGOUT: '/auth/logout',
            VERIFY: '/auth/verify',
            REFRESH: '/auth/refresh',
        },
        PAYMENT: {
            CHECKOUT: '/pay/checkout-session',
            PORTAL: '/stripe-portal/session',
        },
        USER: {
            STATUS: '/user/status',
            PROFILE: '/user/profile',
            UPDATE_PROFILE: '/user/update-profile',
            DELETE_ACCOUNT: '/user/delete-account',
        },
    }
};

export default API_CONFIG;
