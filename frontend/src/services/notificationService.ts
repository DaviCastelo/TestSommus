import { DengueData } from '../types/dengue';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private subscribers: ((notifications: Notification[]) => void)[] = [];

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.notifications));
  }

  public addNotification(notification: Omit<Notification, 'id' | 'timestamp'>) {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };

    this.notifications.unshift(newNotification);
    this.notifySubscribers();

    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.removeNotification(newNotification.id);
    }, 5000);
  }

  public removeNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifySubscribers();
  }

  public getNotifications(): Notification[] {
    return this.notifications;
  }

  public clearNotifications() {
    this.notifications = [];
    this.notifySubscribers();
  }

  public checkDengueAlerts(data: DengueData[]) {
    const latestData = data[0];
    if (!latestData) return;

    if (latestData.nivel_alerta >= 3) {
      this.addNotification({
        message: `Alerta: Nível de alerta ${latestData.nivel_alerta} detectado na semana ${latestData.semana_epidemiologica}`,
        type: 'error'
      });
    } else if (latestData.nivel_alerta === 2) {
      this.addNotification({
        message: `Atenção: Nível de alerta ${latestData.nivel_alerta} detectado na semana ${latestData.semana_epidemiologica}`,
        type: 'warning'
      });
    }

    // Check for significant increase in cases
    const previousWeek = data[1];
    if (previousWeek) {
      const increasePercentage = ((latestData.casos_est - previousWeek.casos_est) / previousWeek.casos_est) * 100;
      if (increasePercentage > 50) {
        this.addNotification({
          message: `Aumento significativo de casos: ${increasePercentage.toFixed(1)}% em relação à semana anterior`,
          type: 'warning'
        });
      }
    }
  }
}

export const notificationService = NotificationService.getInstance(); 