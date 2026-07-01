import { useState, useCallback, useEffect } from 'react';

interface UseApiOptions {
  autoFetch?: boolean;
  onError?: (error: string) => void;
  onSuccess?: (data: unknown) => void;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

/**
 * Hook for centralized API calls
 * Provides loading, error, and data state management
 * Foundation for real-time updates
 */
export function useApi<T = unknown>(
  url: string | null,
  options: UseApiOptions = {}
) {
  const { autoFetch = true, onError, onSuccess } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const jsonData: ApiResponse<T> = await response.json();

      if (jsonData.data) {
        setData(jsonData.data);
        onSuccess?.(jsonData.data);
      } else if (jsonData.error || jsonData.message) {
        const errorMsg = jsonData.error || jsonData.message || 'Unknown error';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [url, onError, onSuccess]);

  useEffect(() => {
    if (autoFetch && url) {
      fetchData();
    }
  }, [url, autoFetch, fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

/**
 * Hook for POST/PUT/DELETE API calls
 */
export function useMutation<T = unknown>(
  options: UseApiOptions = {}
) {
  const { onError, onSuccess } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (
      url: string,
      method: 'POST' | 'PUT' | 'DELETE',
      body?: unknown
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const jsonData: ApiResponse<T> = await response.json();

        if (jsonData.data) {
          onSuccess?.(jsonData.data);
          return jsonData.data;
        } else if (jsonData.error || jsonData.message) {
          const errorMsg = jsonData.error || jsonData.message || 'Unknown error';
          setError(errorMsg);
          onError?.(errorMsg);
          return null;
        }

        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        onError?.(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [onError, onSuccess]
  );

  return { mutate, loading, error };
}
