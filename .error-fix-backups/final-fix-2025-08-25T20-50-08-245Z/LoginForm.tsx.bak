// LoginForm - React Component
import React, { useState, useEffect } from 'react';

export interface LoginFormProps {
  className?: string;
  children?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  className = '',
  children,
  onLoad,
  onError
}) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 200));
        setIsReady(true);
        onLoad?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Initialization failed');
        setError(error);
        onError?.(error);
      }
    };

    initialize();
  }, [onLoad, onError]);

  if (error) {
    return (
      <div className={'error-state ' + className}>
        <h3>Error in LoginForm</h3>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className={'loading-state ' + className}>
        <div>Loading LoginForm...</div>
      </div>
    );
  }

  return (
    <div className={'component-ready ' + className}>
      <div className="component-header">
        <h2>LoginForm</h2>
      </div>
      <div className="component-body">
        {children || (
          <div className="default-content">
            <p>Component is ready and functioning properly.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;