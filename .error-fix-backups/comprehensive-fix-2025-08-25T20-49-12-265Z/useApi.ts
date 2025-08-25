// useApi - Custom Hook
import { useState, useEffect, useCallback } from 'react';

export interface UseApiOptions {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export interface UseApiResult {
  data;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useApi(
  options: UseApiOptions = {}
): UseApiResult {
  const { enabled = true, onSuccess, onError } = options;
  
  const [data: any, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = {
        hookName: 'useApi',
        timestamp: Date.now(),
        success: true
      };
      
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data: any,
    loading,
    error,
    refetch: fetchData
  };
}

export default useApi;