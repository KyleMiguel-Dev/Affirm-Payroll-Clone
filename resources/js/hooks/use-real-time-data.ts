import { useEffect, useState, useCallback, useRef } from 'react';
import RealTimeService from '@/services/realTimeService';

interface UseRealTimeDataOptions {
  enabled?: boolean;
  pollingInterval?: number;
  onUpdate?: (data: unknown) => void;
}

/**
 * Hook for subscribing to real-time data updates
 * Automatically manages subscription lifecycle and cleanup
 * Shows last update time and update status
 */
export function useRealTimeData(
  channel: string,
  options: UseRealTimeDataOptions = {}
) {
  const { enabled = true, pollingInterval, onUpdate } = options;

  const [data, setData] = useState<unknown>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const subscriptionRef = useRef<ReturnType<typeof RealTimeService.prototype.subscribe> | null>(
    null
  );

  const rtService = RealTimeService.getInstance({
    mode: 'polling',
    pollingInterval: pollingInterval || 30000,
  });

  // Initialize on mount
  useEffect(() => {
    if (!enabled) return;

    rtService.initialize();

    // Subscribe to channel
    const subscription = rtService.subscribe(channel, (newData) => {
      setIsUpdating(true);
      setData(newData);
      setLastUpdate(new Date());
      onUpdate?.(newData);

      // Reset updating state after animation
      setTimeout(() => setIsUpdating(false), 500);
    });

    subscriptionRef.current = subscription;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [channel, enabled, onUpdate, pollingInterval]);

  const forceUpdate = useCallback(() => {
    rtService.forceRefresh(channel);
  }, [channel]);

  const getTimeSinceUpdate = useCallback((): string => {
    if (!lastUpdate) return 'Never';

    const seconds = Math.floor(
      (new Date().getTime() - lastUpdate.getTime()) / 1000
    );

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  }, [lastUpdate]);

  return {
    data,
    lastUpdate,
    isUpdating,
    forceUpdate,
    timeSinceUpdate: getTimeSinceUpdate(),
  };
}

/**
 * Hook for multiple real-time data channels
 * Subscribe to multiple channels and aggregate data
 */
export function useRealTimeDataMultiple(
  channels: string[],
  options: UseRealTimeDataOptions = {}
) {
  const { enabled = true, pollingInterval, onUpdate } = options;

  const [dataMap, setDataMap] = useState<Record<string, unknown>>({});
  const [lastUpdates, setLastUpdates] = useState<Record<string, Date>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const subscriptionsRef = useRef<
    Array<ReturnType<typeof RealTimeService.prototype.subscribe>>
  >([]);

  const rtService = RealTimeService.getInstance({
    mode: 'polling',
    pollingInterval: pollingInterval || 30000,
  });

  useEffect(() => {
    if (!enabled || channels.length === 0) return;

    rtService.initialize();

    // Subscribe to all channels
    subscriptionsRef.current = channels.map((channel) =>
      rtService.subscribe(channel, (newData) => {
        setIsUpdating(true);
        setDataMap((prev) => ({ ...prev, [channel]: newData }));
        setLastUpdates((prev) => ({ ...prev, [channel]: new Date() }));
        onUpdate?.(newData);

        setTimeout(() => setIsUpdating(false), 500);
      })
    );

    return () => {
      subscriptionsRef.current.forEach((sub) => sub.unsubscribe());
      subscriptionsRef.current = [];
    };
  }, [channels.join(','), enabled, onUpdate, pollingInterval]);

  const forceUpdateAll = useCallback(() => {
    channels.forEach((channel) => {
      rtService.forceRefresh(channel);
    });
  }, [channels]);

  const forceUpdateChannel = useCallback((channel: string) => {
    rtService.forceRefresh(channel);
  }, []);

  return {
    dataMap,
    lastUpdates,
    isUpdating,
    forceUpdateAll,
    forceUpdateChannel,
  };
}
