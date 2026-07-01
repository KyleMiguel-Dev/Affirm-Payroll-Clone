/**
 * Real-Time Service
 * Handles polling for live updates and provides foundation for WebSocket broadcasting
 * Supports both polling (current) and WebSocket (future) modes
 */

export type RealTimeMode = 'polling' | 'websocket';

export interface RealTimeServiceConfig {
  mode: RealTimeMode;
  pollingInterval?: number; // milliseconds
  enableAutoReconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number; // milliseconds
}

export interface RealTimeSubscription {
  id: string;
  channel: string;
  callback: (data: unknown) => void;
  unsubscribe: () => void;
}

class RealTimeService {
  private static instance: RealTimeService;
  private config: RealTimeServiceConfig;
  private subscriptions: Map<string, RealTimeSubscription> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private reconnectAttempts: number = 0;
  private isConnected: boolean = false;
  private lastUpdateTime: Map<string, number> = new Map();

  private constructor(config: RealTimeServiceConfig) {
    this.config = {
      pollingInterval: 30000, // 30 seconds default
      enableAutoReconnect: true,
      maxReconnectAttempts: 5,
      reconnectDelay: 3000,
      ...config,
    };
  }

  static getInstance(
    config?: RealTimeServiceConfig
  ): RealTimeService {
    if (!RealTimeService.instance) {
      RealTimeService.instance = new RealTimeService(
        config || { mode: 'polling' }
      );
    }
    return RealTimeService.instance;
  }

  /**
   * Initialize the real-time service
   */
  initialize(): void {
    if (this.config.mode === 'polling') {
      this.isConnected = true;
      console.log('[RealTime] Polling mode initialized');
    } else if (this.config.mode === 'websocket') {
      this.connectWebSocket();
    }
  }

  /**
   * Subscribe to real-time updates for a channel
   * Polling: Sets up a polling interval for the channel
   * WebSocket: Would subscribe to the broadcast channel
   */
  subscribe(
    channel: string,
    callback: (data: unknown) => void
  ): RealTimeSubscription {
    const subscriptionId = `${channel}-${Date.now()}`;

    const subscription: RealTimeSubscription = {
      id: subscriptionId,
      channel,
      callback,
      unsubscribe: () => this.unsubscribe(subscriptionId),
    };

    this.subscriptions.set(subscriptionId, subscription);

    if (this.config.mode === 'polling') {
      this.setupPolling(channel);
    } else if (this.config.mode === 'websocket') {
      this.subscribeWebSocket(channel, callback);
    }

    return subscription;
  }

  /**
   * Unsubscribe from real-time updates
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      this.subscriptions.delete(subscriptionId);

      // Clean up polling if no more subscriptions for this channel
      const hasChannelSubscriptions = Array.from(this.subscriptions.values()).some(
        (s) => s.channel === subscription.channel
      );

      if (!hasChannelSubscriptions && this.pollingIntervals.has(subscription.channel)) {
        clearInterval(this.pollingIntervals.get(subscription.channel));
        this.pollingIntervals.delete(subscription.channel);
      }
    }
  }

  /**
   * Setup polling for a specific channel
   */
  private setupPolling(channel: string): void {
    if (this.pollingIntervals.has(channel)) {
      return; // Already polling this channel
    }

    const pollOnce = async () => {
      try {
        const data = await this.fetchChannelData(channel);
        this.broadcastToSubscribers(channel, data);
      } catch (error) {
        console.error(`[RealTime] Error polling ${channel}:`, error);
      }
    };

    // Fetch immediately
    pollOnce();

    // Then set up interval
    const intervalId = setInterval(
      pollOnce,
      this.config.pollingInterval || 30000
    );

    this.pollingIntervals.set(channel, intervalId);
  }

  /**
   * Fetch data for a channel
   * In a real implementation, this would call an API endpoint
   */
  private async fetchChannelData(channel: string): Promise<unknown> {
    const lastUpdate = this.lastUpdateTime.get(channel) || 0;
    const now = Date.now();

    // Return cached data if called too recently (within 5 seconds)
    if (now - lastUpdate < 5000) {
      return null;
    }

    try {
      // Map channel names to API endpoints
      const apiEndpoint = this.mapChannelToEndpoint(channel);
      if (!apiEndpoint) {
        return null;
      }

      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      this.lastUpdateTime.set(channel, now);
      return data;
    } catch (error) {
      console.error(`[RealTime] Error fetching ${channel} data:`, error);
      throw error;
    }
  }

  /**
   * Map channel names to API endpoints
   */
  private mapChannelToEndpoint(channel: string): string | null {
    const channelMap: Record<string, string> = {
      'dashboard.kpi': '/api/dashboard/kpi',
      'attendance.status': '/api/attendance/status',
      'payroll.summary': '/api/payroll/summary',
      'employees.list': '/api/employees',
      'leave-requests.pending': '/api/leave-requests/pending',
    };

    return channelMap[channel] || null;
  }

  /**
   * Broadcast data to all subscribers of a channel
   */
  private broadcastToSubscribers(channel: string, data: unknown): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription.channel === channel && data) {
        subscription.callback(data);
      }
    });
  }

  /**
   * WebSocket connection (future implementation)
   */
  private connectWebSocket(): void {
    console.log('[RealTime] WebSocket mode not yet implemented');
    // Future: Implement WebSocket broadcasting
  }

  /**
   * WebSocket subscription (future implementation)
   */
  private subscribeWebSocket(
    channel: string,
    callback: (data: unknown) => void
  ): void {
    console.log(
      `[RealTime] WebSocket subscription not yet implemented for ${channel}`
    );
    // Future: Connect to Laravel Broadcasting
  }

  /**
   * Disconnect the real-time service
   */
  disconnect(): void {
    // Clear all polling intervals
    this.pollingIntervals.forEach((interval) => clearInterval(interval));
    this.pollingIntervals.clear();
    this.subscriptions.clear();
    this.isConnected = false;
    console.log('[RealTime] Disconnected');
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      mode: this.config.mode,
      isConnected: this.isConnected,
      activeSubscriptions: this.subscriptions.size,
      activePollingChannels: this.pollingIntervals.size,
    };
  }

  /**
   * Get last update time for a channel
   */
  getLastUpdateTime(channel: string): number | null {
    return this.lastUpdateTime.get(channel) || null;
  }

  /**
   * Force refresh a channel
   */
  forceRefresh(channel: string): void {
    if (this.subscriptions.size === 0) return;

    const subscription = Array.from(this.subscriptions.values()).find(
      (s) => s.channel === channel
    );

    if (subscription) {
      this.setupPolling(channel);
    }
  }
}

export default RealTimeService;
