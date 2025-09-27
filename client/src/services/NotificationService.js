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

    // Additional methods needed by useNotifications hook
    subscribe(callback) {
        // Mock subscription - in a real app, this would set up event listeners
        console.log('NotificationService: Subscribed to notifications');
        return () => {
            console.log('NotificationService: Unsubscribed from notifications');
        };
    }

    removeNotification(id) {
        console.log('NotificationService: Removing notification', id);
        // In a real app, this would remove the notification from state
    }

    clearAllNotifications() {
        console.log('NotificationService: Clearing all notifications');
        // In a real app, this would clear all notifications from state
    }
}

export default NotificationService;