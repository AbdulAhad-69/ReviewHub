export const API_BASE_URL = 'http://localhost:5000/api/v1';

// A universal fetch wrapper to handle JSON parsing and error formatting
export const fetchApi = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        credentials: 'include', // CRITICAL: Sends our HttpOnly JWT cookies
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const finalOptions = { ...defaultOptions, ...options };

    // Merge headers safely if custom headers are provided
    if (options.headers) {
        finalOptions.headers = { ...defaultOptions.headers, ...options.headers };
    }

    try {
        const response = await fetch(url, finalOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'An error occurred during the request');
        }

        return data;
    } catch (error) {
        console.error(`[API Error] ${endpoint}:`, error.message);
        throw error;
    }
};