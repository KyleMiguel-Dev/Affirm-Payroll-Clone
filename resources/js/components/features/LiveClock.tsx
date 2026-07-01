import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface LiveClockProps {
  format?: '12h' | '24h';
  showDate?: boolean;
  showSeconds?: boolean;
  syncInterval?: number; // minutes between server sync
  className?: string;
}

/**
 * Live Clock Component
 * Displays real-time server time that updates every second
 * Periodically syncs with server to prevent drift
 * Shows last server sync status
 */
export default function LiveClock({
  format = '24h',
  showDate = true,
  showSeconds = true,
  syncInterval = 5, // Sync with server every 5 minutes
  className = '',
}: LiveClockProps) {
  const [time, setTime] = useState<Date>(new Date());
  const [serverTime, setServerTime] = useState<Date | null>(null);
  const [drift, setDrift] = useState(0);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync with server time on mount and periodically
  useEffect(() => {
    const syncWithServer = async () => {
      try {
        setIsSyncing(true);
        const response = await fetch('/api/server-time');
        const data = await response.json();

        if (data.timestamp) {
          const serverDate = new Date(data.timestamp);
          const clientNow = new Date();
          const calculatedDrift = serverDate.getTime() - clientNow.getTime();

          setServerTime(serverDate);
          setDrift(calculatedDrift);
          setLastSync(new Date());
          setTime(serverDate);
        }
      } catch (error) {
        console.error('Failed to sync time with server:', error);
      } finally {
        setIsSyncing(false);
      }
    };

    // Initial sync
    syncWithServer();

    // Periodic sync
    const syncIntervalId = setInterval(syncWithServer, syncInterval * 60 * 1000);

    return () => clearInterval(syncIntervalId);
  }, [syncInterval]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date(Date.now() + drift));
    }, 1000);

    return () => clearInterval(timer);
  }, [drift]);

  const formatTime = (): string => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');

    if (format === '12h') {
      const hour12 = time.getHours() % 12 || 12;
      const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
      const timeStr = `${String(hour12).padStart(2, '0')}:${minutes}${
        showSeconds ? ':' + seconds : ''
      } ${ampm}`;
      return timeStr;
    }

    return `${hours}:${minutes}${showSeconds ? ':' + seconds : ''}`;
  };

  const formatDate = (): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return time.toLocaleDateString(undefined, options);
  };

  const getTimeSinceLastSync = (): string => {
    if (!lastSync) return '';

    const seconds = Math.floor(
      (new Date().getTime() - lastSync.getTime()) / 1000
    );

    if (seconds < 60) return `synced ${seconds}s ago`;
    if (seconds < 3600) return `synced ${Math.floor(seconds / 60)}m ago`;
    return `synced ${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Clock Icon */}
      <Clock
        size={18}
        className={`${
          isSyncing ? 'animate-spin text-blue-500' : 'text-gray-500'
        } transition-colors`}
      />

      {/* Time Display */}
      <div className="flex flex-col gap-0.5">
        <div className="text-sm font-semibold text-gray-900 tabular-nums">
          {formatTime()}
        </div>

        {showDate && (
          <div className="text-xs text-gray-500">
            {formatDate()}
          </div>
        )}
      </div>

      {/* Sync Status Indicator */}
      {lastSync && !isSyncing && (
        <div
          title={getTimeSinceLastSync()}
          className="ml-2 w-2 h-2 rounded-full bg-green-500"
        />
      )}

      {isSyncing && (
        <div className="ml-2 w-2 h-2 rounded-full bg-yellow-500" />
      )}
    </div>
  );
}
