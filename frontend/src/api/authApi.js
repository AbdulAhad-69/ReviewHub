import { fetchApi } from './config.js';

export const AuthAPI = {
    register: async (userData) => {
        return await fetchApi('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    login: async (email, password) => {
        return await fetchApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    logout: async () => {
        return await fetchApi('/auth/logout', {
            method: 'POST'
        });
    },

    // Used on page load to check if the user's secure cookie is still valid
    getMe: async () => {
        return await fetchApi('/auth/me', {
            method: 'GET'
        });
    }
};