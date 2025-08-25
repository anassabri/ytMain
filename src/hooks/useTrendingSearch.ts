// useTrendingSearch - Clean Hook Implementation
import { useState, useEffect, useCallback } from 'react';

export interface UseTrendingSearchOptions {
  enabled?: boolean;
  onSuccess?: (data) => void;
  onError?: (error: Error) => void;
}

export interface UseTrendingSearchResult {
  data;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useTrendingSearch(
  options: UseTrendingSearchOptions = {}
): UseTrendingSearchResult {
  const { enabled = true, onSuccess, onError } = options;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = {
        hookName: 'useTrendingSearch',
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

export default useTrendingSearch;