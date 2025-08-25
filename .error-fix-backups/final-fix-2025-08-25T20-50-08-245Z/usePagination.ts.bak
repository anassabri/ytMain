import _React from 'react';
// usePagination - Simple Hook
import { useState } from 'react';

export function usePagination() {
  const [data, _setData] = useState(null);
  const [loading, _setLoading] = useState(false);
  const [error, _setError] = useState<Error | null>(null);

  return {
    data,
    loading,
    error
  };
}

export default usePagination;