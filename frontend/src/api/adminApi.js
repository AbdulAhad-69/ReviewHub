import { fetchApi } from './config.js';

export const AdminAPI = {
    getQueue: async () => {
        return await fetchApi('/admin/queue', {
            method: 'GET'
        });
    },

    approveReview: async (reviewId) => {
        return await fetchApi(`/admin/verify/${reviewId}`, {
            method: 'PUT'
        });
    },

    rejectReview: async (reviewId) => {
        return await fetchApi(`/admin/reject/${reviewId}`, {
            method: 'DELETE'
        });
    }
    
};