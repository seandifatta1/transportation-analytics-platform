import axios from 'axios';

export class HttpClient {
    constructor(baseURL = 'http://localhost:8081') {
        this.client = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add request interceptor for auth
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    async get(url, config = {}) {
        try {
            const response = await this.client.get(url, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async post(url, data, config = {}) {
        try {
            const response = await this.client.post(url, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async put(url, data, config = {}) {
        try {
            const response = await this.client.put(url, data, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async delete(url, config = {}) {
        try {
            const response = await this.client.delete(url, config);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response) {
            // Server responded with error status
            return new Error(error.response.data.message || 'Server error');
        } else if (error.request) {
            // Request was made but no response received
            return new Error('Network error - no response from server');
        } else {
            // Something else happened
            return new Error(error.message || 'Unknown error');
        }
    }
}

export default HttpClient;