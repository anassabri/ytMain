import _React from 'react';
// useSubscription - Simple Hook
import { useState } from 'react';

// Define a generic subscription type
interface Subscription {
  channelId: string;
  channelName: string;
  subscriberCount: number;
  isSubscribed: boolean;
}

export function useSubscription() {
  const [data, setData] = useState<Subscription | null>(null);
  const [loading, _setLoading] = useState(false);
  const [error, _setError] = useState<string | null>(null);

  return {
    data,
    loading,
    error,
    setData
  };
}

export default useSubscription;