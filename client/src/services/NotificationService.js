import { BaseService } from './BaseService';
import { INotificationService } from './types';
import { Snackbar, Alert } from '@mui/material';

export class NotificationService extends BaseService implements INotificationService {
    private notifications: any[] = [];
    private listeners: ((notifications: any[]) => void)[] = [];

    constructor() {
        super('NotificationService');
    }

    protected async onInitialize(): Promise<void> {
        this.log('info', 'NotificationService initialized');
    }

    protected async onDestroy(): Promise<void> {
        this.log('info', 'NotificationService destroyed');
        this.notifications = [];
        this.listeners = [];
    }

    showSuccess(message: string): void {
        this.addNotification({
            id: this.generateId(),
            type: 'success',
            message,
            timestamp: new Date(),
            duration: 4000
        });
    }

    showError(message: string): void {
        this.addNotification({
            id: this.generateId(),
            type: 'error',
            message,
            timestamp: new Date(),
            duration: 6000
        });
    }

    showWarning(message: string): void {
        this.addNotification({
            id: this.generateId(),
            type: 'warning',
            message,
            timestamp: new Date(),
            duration: 5000
        });
    }

    showInfo(message: string): void {
        this.addNotification({
            id: this.generateId(),
            type: 'info',
            message,
            timestamp: new Date(),
            duration: 4000
        });
    }

    // Additional methods for advanced notification management
    showNotification(notification: {
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
        duration?: number;
        action?: {
            label: string;
            onClick: () => void;
        };
    }): void {
        this.addNotification({
            id: this.generateId(),
            ...notification,
            timestamp: new Date(),
            duration: notification.duration || 4000
        });
    }

    removeNotification(id: string): void {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.notifyListeners();
    }

    clearAllNotifications(): void {
        this.notifications = [];
        this.notifyListeners();
    }

    getNotifications(): any[] {
        return [...this.notifications];
    }

    subscribe(listener: (notifications: any[]) => void): () => void {
        this.listeners.push(listener);
        
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private addNotification(notification: any): void {
        this.notifications.unshift(notification);
        
        // Limit to 10 notifications max
        if (this.notifications.length > 10) {
            this.notifications = this.notifications.slice(0, 10);
        }
        
        this.notifyListeners();
        
        // Auto-remove after duration
        if (notification.duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification.id);
            }, notification.duration);
        }
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => {
            try {
                listener([...this.notifications]);
            } catch (error) {
                this.log('error', 'Error in notification listener:', error);
            }
        });
    }

    private generateId(): string {
        return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

export default NotificationService;
