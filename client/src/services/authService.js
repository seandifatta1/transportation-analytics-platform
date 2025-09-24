import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

class AuthService {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        
        // Set up axios interceptor to include token in requests
        this.setupAxiosInterceptor();
    }

    setupAxiosInterceptor() {
        // Request interceptor to add token to headers
        axios.interceptors.request.use(
            (config) => {
                if (this.token) {
                    config.headers.Authorization = `Bearer ${this.token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor to handle token expiration
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    this.logout();
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    async login(email, password) {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email,
                password
            });

            if (response.data.success) {
                const { token, user } = response.data.data;
                this.setAuthData(token, user);
                return { success: true, user };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        }
    }

    async register(email, password, firstName = '', lastName = '') {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                email,
                password,
                firstName,
                lastName
            });

            if (response.data.success) {
                const { token, user } = response.data.data;
                this.setAuthData(token, user);
                return { success: true, user };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Registration failed' 
            };
        }
    }

    async logout() {
        try {
            // Call logout endpoint to invalidate token on server
            if (this.token) {
                await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuthData();
        }
    }

    async validateSession() {
        try {
            if (!this.token) {
                return { valid: false, user: null };
            }

            const response = await axios.get(`${API_BASE_URL}/auth/validate`, {
                headers: { Authorization: `Bearer ${this.token}` }
            });

            if (response.data.success) {
                this.user = response.data.data.user;
                localStorage.setItem('user', JSON.stringify(this.user));
                return { valid: true, user: this.user };
            } else {
                this.clearAuthData();
                return { valid: false, user: null };
            }
        } catch (error) {
            console.error('Session validation error:', error);
            this.clearAuthData();
            return { valid: false, user: null };
        }
    }

    async refreshToken() {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
                headers: { Authorization: `Bearer ${this.token}` }
            });

            if (response.data.success) {
                const { token } = response.data.data;
                this.token = token;
                localStorage.setItem('authToken', token);
                return { success: true, token };
            } else {
                this.clearAuthData();
                return { success: false };
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            this.clearAuthData();
            return { success: false };
        }
    }

    setAuthData(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
    }

    clearAuthData() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }

    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    getToken() {
        return this.token;
    }

    getUser() {
        return this.user;
    }

    getUserId() {
        return this.user?.id;
    }

    getUserEmail() {
        return this.user?.email;
    }

    // Legacy method for backward compatibility
    async checkAuth() {
        const result = await this.validateSession();
        return result.valid;
    }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
