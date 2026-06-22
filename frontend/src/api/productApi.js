import { fetchApi } from './config.js';

export const ProductAPI = {
    getAllProducts: async (filters = '') => {
        // filters could be "?category=Electronics&sort=-metrics.wilsonScore"
        return await fetchApi(`/products${filters}`, {
            method: 'GET'
        });
    },

    getProductById: async (id) => {
        return await fetchApi(`/products/${id}`, {
            method: 'GET'
        });
    },

    getProductReviews: async (productId) => {
        return await fetchApi(`/products/${productId}/reviews`, {
            method: 'GET'
        });
    },

    submitReview: async (productId, reviewData, receiptFile) => {
        const formData = new FormData();
        formData.append('content', reviewData.content);
        // Stringify attributes so Multer can parse them on the backend
        formData.append('attributes', JSON.stringify(reviewData.attributes));

        if (receiptFile) {
            formData.append('receipt', receiptFile);
        }

        // We bypass the standard fetchApi wrapper here because the browser MUST 
        // automatically set the multipart/form-data boundary headers for files.
        const response = await fetch(`http://localhost:5000/api/v1/products/${productId}/reviews`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Review submission failed');
        return data;
    }
};