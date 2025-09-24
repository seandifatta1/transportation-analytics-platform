import { BaseService } from './BaseService.js';

export class NotificationService extends BaseService {
    constructor() {
        super('NotificationService');
    }

    async initialize() {
        console.log('NotificationService initialized');
    }

    async destroy() {
        console.log('NotificationService destroyed');
    }

    showSuccess(message) {
        console.log('✅ Success:', message);
        // In a real app, this would show a toast notification
        alert(`Success: ${message}`);
    }

    showError(message) {
        console.error('❌ Error:', message);
        // In a real app, this would show an error toast
        alert(`Error: ${message}`);
    }

    showWarning(message) {
        console.warn('⚠️ Warning:', message);
        // In a real app, this would show a warning toast
        alert(`Warning: ${message}`);
    }

    showInfo(message) {
        console.log('ℹ️ Info:', message);
        // In a real app, this would show an info toast
        alert(`Info: ${message}`);
    }
}

export default NotificationService;