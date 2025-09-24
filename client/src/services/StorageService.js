import { BaseService } from './BaseService';
import { IStorageService } from './types';

export class StorageService extends BaseService implements IStorageService {
    private prefix: string;

    constructor(prefix: string = 'transportation_analytics_') {
        super('StorageService');
        this.prefix = prefix;
    }

    protected async onInitialize(): Promise<void> {
        this.log('info', 'StorageService initialized');
    }

    protected async onDestroy(): Promise<void> {
        this.log('info', 'StorageService destroyed');
    }

    get<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(this.prefix + key);
            if (item === null) {
                return null;
            }
            return JSON.parse(item);
        } catch (error) {
            this.log('error', `Failed to get item '${key}':`, error);
            return null;
        }
    }

    set<T>(key: string, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(this.prefix + key, serializedValue);
        } catch (error) {
            this.log('error', `Failed to set item '${key}':`, error);
        }
    }

    remove(key: string): void {
        try {
            localStorage.removeItem(this.prefix + key);
        } catch (error) {
            this.log('error', `Failed to remove item '${key}':`, error);
        }
    }

    clear(): void {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            this.log('error', 'Failed to clear storage:', error);
        }
    }

    // Additional utility methods
    has(key: string): boolean {
        return localStorage.getItem(this.prefix + key) !== null;
    }

    keys(): string[] {
        const allKeys = Object.keys(localStorage);
        return allKeys
            .filter(key => key.startsWith(this.prefix))
            .map(key => key.substring(this.prefix.length));
    }

    size(): number {
        return this.keys().length;
    }

    // Session storage methods
    getSession<T>(key: string): T | null {
        try {
            const item = sessionStorage.getItem(this.prefix + key);
            if (item === null) {
                return null;
            }
            return JSON.parse(item);
        } catch (error) {
            this.log('error', `Failed to get session item '${key}':`, error);
            return null;
        }
    }

    setSession<T>(key: string, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            sessionStorage.setItem(this.prefix + key, serializedValue);
        } catch (error) {
            this.log('error', `Failed to set session item '${key}':`, error);
        }
    }

    removeSession(key: string): void {
        try {
            sessionStorage.removeItem(this.prefix + key);
        } catch (error) {
            this.log('error', `Failed to remove session item '${key}':`, error);
        }
    }

    clearSession(): void {
        try {
            const keys = Object.keys(sessionStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    sessionStorage.removeItem(key);
                }
            });
        } catch (error) {
            this.log('error', 'Failed to clear session storage:', error);
        }
    }

    // Cookie methods (for compatibility)
    getCookie(name: string): string | null {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift() || null;
        }
        return null;
    }

    setCookie(name: string, value: string, days: number = 7): void {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    removeCookie(name: string): void {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }

    // Cache methods with TTL
    setWithTTL<T>(key: string, value: T, ttlMinutes: number): void {
        const item = {
            value,
            expires: Date.now() + (ttlMinutes * 60 * 1000)
        };
        this.set(key, item);
    }

    getWithTTL<T>(key: string): T | null {
        const item = this.get<{ value: T; expires: number }>(key);
        if (!item) {
            return null;
        }

        if (Date.now() > item.expires) {
            this.remove(key);
            return null;
        }

        return item.value;
    }

    // Batch operations
    getMany<T>(keys: string[]): Record<string, T | null> {
        const result: Record<string, T | null> = {};
        keys.forEach(key => {
            result[key] = this.get<T>(key);
        });
        return result;
    }

    setMany<T>(items: Record<string, T>): void {
        Object.entries(items).forEach(([key, value]) => {
            this.set(key, value);
        });
    }

    removeMany(keys: string[]): void {
        keys.forEach(key => {
            this.remove(key);
        });
    }
}

export default StorageService;
