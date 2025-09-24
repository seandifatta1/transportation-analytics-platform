import { BaseService } from './BaseService.js';

export class StorageService extends BaseService {
    constructor(prefix = 'transportation_analytics_') {
        super('StorageService');
        this.prefix = prefix;
    }

    async initialize() {
        console.log('StorageService initialized');
    }

    async destroy() {
        console.log('StorageService destroyed');
    }

    get(key) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error getting from storage:', error);
            return null;
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
        } catch (error) {
            console.error('Error setting storage:', error);
        }
    }

    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
        } catch (error) {
            console.error('Error removing from storage:', error);
        }
    }

    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }
}

export default StorageService;