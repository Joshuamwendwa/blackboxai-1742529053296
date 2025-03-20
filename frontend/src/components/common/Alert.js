import React from 'react';

function Alert({ type = 'info', message, onClose }) {
  const types = {
    success: {
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      borderColor: 'border-green-400',
      icon: 'fas fa-check-circle text-green-400'
    },
    error: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      borderColor: 'border-red-400',
      icon: 'fas fa-exclamation-circle text-red-400'
    },
    warning: {
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-400',
      icon: 'fas fa-exclamation-triangle text-yellow-400'
    },
    info: {
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-400',
      icon: 'fas fa-info-circle text-blue-400'
    }
  };

  const { bgColor, textColor, borderColor, icon } = types[type];

  return (
    <div className={`rounded-md ${bgColor} p-4 mb-4 border ${borderColor}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <i className={`${icon} text-xl`}></i>
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm ${textColor}`}>{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${textColor} hover:${bgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${bgColor} focus:ring-${borderColor}`}
              >
                <span className="sr-only">Dismiss</span>
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Alert;

// Usage examples:
// <Alert type="success" message="Operation completed successfully" />
// <Alert type="error" message="An error occurred" onClose={() => {}} />
// <Alert type="warning" message="Please review your input" />
// <Alert type="info" message="New features available" />