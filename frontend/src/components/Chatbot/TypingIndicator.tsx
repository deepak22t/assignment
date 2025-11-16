/**
 * Advanced animated typing indicator
 */
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4 animate-fadeIn">
      <div className="flex items-end gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md ring-2 ring-white">
          <span className="text-base">🤖</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
          <div className="flex space-x-1.5">
            <div 
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" 
              style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
            ></div>
            <div 
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" 
              style={{ animationDelay: '200ms', animationDuration: '1.4s' }}
            ></div>
            <div 
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" 
              style={{ animationDelay: '400ms', animationDuration: '1.4s' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
