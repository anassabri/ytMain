import _React from 'react';
// useQueryClient - Simple Hook
import { useState } from 'react';

export function useQueryClient() {
  const [data, _setData] = useState(null);
  const [loading, _setLoading] = useState(false);
  const [error, _setError] = useState<Error | null>(null);

  return {
    data,
    loading,
    error
  };
}

export default useQueryClient;