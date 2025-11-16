/**
 * Advanced animated message bubble component with integrated properties
 */
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Message, Property } from '../../types';
import { PropertiesList } from './PropertyCard';

interface MessageBubbleProps {
  message: Message;
  index: number;
  properties?: Property[];
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, index, properties }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isUser = message.type === 'user';
  const isError = message.isError;

  useEffect(() => {
    // Stagger animation based on index
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 50);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`flex mb-4 w-full ${isUser ? 'justify-end' : 'justify-start'} ${
        isVisible ? 'animate-slideInRight' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`flex ${isUser ? 'flex-row' : 'flex-row'} items-end gap-3 ${isUser ? 'max-w-md ml-auto' : 'max-w-3xl w-full'}`}>
        {/* Bot Avatar */}
        {!isUser && (
          <div className="flex-shrink-0 relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md ring-2 ring-white">
              <span className="text-base">🤖</span>
            </div>
          </div>
        )}
        
        {/* Message Content */}
        <div className={`flex flex-col gap-1.5 ${isUser ? 'flex-shrink' : 'flex-1 min-w-0'}`}>
          <div
            className={`group rounded-2xl px-4 py-3 transform transition-all duration-200 relative ${
              isUser
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md shadow-md hover:shadow-lg'
                : isError
                ? 'bg-red-50 text-red-900 border border-red-200 rounded-bl-md shadow-sm'
                : 'bg-white text-gray-800 rounded-bl-md border border-gray-200 shadow-sm hover:shadow-md'
            }`}
          >
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed font-normal">{message.text}</p>
            
            {/* Timestamp */}
            <div className={`flex items-center gap-1 mt-1.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
              <span
                className={`text-[11px] font-medium ${
                  isUser ? 'text-blue-100/90' : 'text-gray-400'
                }`}
              >
                {format(message.timestamp, 'HH:mm')}
              </span>
            </div>
          </div>
          
          {/* Properties integrated into agent message */}
          {!isUser && properties && properties.length > 0 && (
            <div className="mt-2">
              <PropertiesList properties={properties} />
            </div>
          )}
        </div>

        {/* User Avatar - on the right */}
        {isUser && (
          <div className="flex-shrink-0 relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white shadow-md ring-2 ring-white">
              <span className="text-base">👤</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
