/**
 * Advanced animated chatbot component
 */
import React from 'react';
import { useChat } from '../../hooks/useChat';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import { Property } from '../../types';

interface ChatbotProps {
  onPropertiesFound?: (properties: Property[]) => void;
  onViewProperties?: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onPropertiesFound, onViewProperties }) => {
  const { messages, isLoading, sendMessage, messagesEndRef } = useChat(
    onPropertiesFound,
    onViewProperties
  );

  const handleQuickAction = (query: string): void => {
    sendMessage(query);
  };

  return (
    <div className="h-full flex flex-col w-full">
      <div className="w-full flex flex-col h-full bg-white relative overflow-hidden">
        {/* Messages Container with advanced styling */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/30 via-white to-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent relative min-h-0">
          <div className="relative z-0 py-6 px-4 md:px-8 lg:px-16 xl:px-24">
                {messages.length === 0 && (
              <div className="text-center py-16 animate-fadeIn">
                <div className="inline-block mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg mx-auto animate-bounce-slow">
                    <span className="text-4xl">👋</span>
                  </div>
                </div>
                <p className="text-gray-800 text-xl font-bold mb-2">Welcome to Real Estate AI!</p>
                <p className="text-gray-500 text-base">Start a conversation to find your perfect property</p>
                  </div>
                )}
                {messages.map((message, idx) => (
                  <div key={message.id} className="animate-fadeInUp" style={{ animationDelay: `${idx * 50}ms` }}>
                    <MessageBubble 
                      message={message} 
                      index={idx}
                      properties={message.properties}
                    />
                  </div>
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Advanced Input */}
            <div className="flex-shrink-0">
              <ChatInput
                onSend={sendMessage}
                isLoading={isLoading}
                onQuickAction={handleQuickAction}
                hasMessages={messages.length > 0}
              />
            </div>
      </div>
    </div>
  );
};

export default Chatbot;
