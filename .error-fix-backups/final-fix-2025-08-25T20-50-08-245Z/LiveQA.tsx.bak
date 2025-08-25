// LiveQA - Enhanced Component
import React, { useState } from 'react';

export interface LiveQAProps {
  className?: string;
  children?: React.ReactNode;
}

export const LiveQA: React.FC<LiveQAProps> = ({
  className = '',
  children
}) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={'component ' + className}>
      <div className="component-header">
        <h3>Live Q A</h3>
      </div>
      
      <div className="component-content">
        {children || (
          <div>
            <button onClick={() => setIsActive(!isActive)}>
              {isActive ? 'Deactivate' : 'Activate'}
            </button>
            {isActive && <p>Component is active!</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveQA;