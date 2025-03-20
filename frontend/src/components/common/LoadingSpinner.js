import React from 'react';

function LoadingSpinner({ size = 'default', fullScreen = false }) {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    default: 'w-10 h-10 border-4',
    large: 'w-16 h-16 border-4'
  };

  const spinnerClass = `spinner ${sizeClasses[size]}`;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className={spinnerClass}></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className={spinnerClass}></div>
    </div>
  );
}

export default LoadingSpinner;

// Usage examples:
// <LoadingSpinner /> - Default size
// <LoadingSpinner size="small" /> - Small spinner
// <LoadingSpinner size="large" /> - Large spinner
// <LoadingSpinner fullScreen /> - Full screen overlay spinner