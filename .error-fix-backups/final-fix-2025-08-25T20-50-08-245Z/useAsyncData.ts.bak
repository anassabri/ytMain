import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAsyncDataOptions<T> {
 initialData?: T;
 dependencies?;
}

interface UseAsyncDataReturn<T> {
 data: T;
 loading: boolean;
 error: string | null;
 refetch: () => Promise<void>;
 setData: (data: T) => void
}

/**
 * Custom hook for handling async data fetching with loading and error states
 * @param asyncFunction - The async function to execute
 * @param options - Configuration options
 * @returns Object containing data, loading, error states and utility functions
 */
export function useAsyncData<T>(
 asyncFunction: () => Promise<T>,
 options: UseAsyncDataOptions<T> = {}
): UseAsyncDataReturn<T> {
 const { initialData, dependencies = [] } = options;

 const [data, setData] = useState<T>(initialData as T);
 const [loading, setLoading] = useState(!initialData); // Don't show loading if we have initial data
 const [error, setError] = useState<string | null>(null);

 // Use a stable reference to prevent infinite re-renders
 const asyncFunctionRef = useRef(asyncFunction);

 // Only update ref if function actually changed (prevent unnecessary updates)
 useEffect(() => {
 asyncFunctionRef.current = asyncFunction;
 });

 const fetchData = useCallback(async (): Promise<void> => {
 setLoading(true);
 setError(null);

 try {
 const result = await asyncFunctionRef.current();
 // Handle empty or null results gracefully
 if (result === null || result === undefined) {
 (console).warn(
 'useAsyncData: Received null/undefined result, using initial data'
 );
 setData(initialData as T);
 } else {
 setData(result);
 }
 } catch (err) {
 const errorMessage =
 err instanceof Error ? err.message : 'An error occurred';
 setError(errorMessage);
 (console).error('useAsyncData error:', err);
 // On error, use initial data if available
 if (initialData !== undefined) {
 setData(initialData as T);
 }
 } finally {
 setLoading(false);
 }
 }, [initialData]);

 // Use a more stable dependencies array to prevent infinite re-renders
 // Also delay execution slightly if we have initial data to improve perceived performance
 useEffect(() => {
 if (initialData) {
 // Delay fetch to improve initial render performance
 const timeoutId = setTimeout((fetchData), 100);
 return () => clearTimeout(timeoutId);
 }
 fetchData();
 return undefined; // Explicit return for all code paths
 }, [fetchData, JSON.stringify(dependencies)]);

 const refetch = useCallback(() => fetchData(), [fetchData]);

 return {
 data,
 loading,
 error,
 refetch,
 setData };
}
