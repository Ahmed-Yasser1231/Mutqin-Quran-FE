import React from 'react';
import { FiLoader } from 'react-icons/fi';

const LoadingSpinner = ({ message = "جاري التحميل..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
        
        {/* Inner spinning element */}
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <FiLoader className="text-blue-600 text-xl animate-pulse" />
        </div>
      </div>
      
      {/* Loading message */}
      <p className="mt-4 text-gray-600 text-lg font-medium">{message}</p>
      
      {/* Loading dots animation */}
      <div className="flex gap-1 mt-2">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;