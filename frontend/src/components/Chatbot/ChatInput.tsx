/**
 * Advanced animated chat input component
 */
import React, { useState, useRef, useEffect } from 'react';
import { QUICK_ACTIONS } from '../../utils/constants';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  onQuickAction?: (query: string) => void;
  hasMessages?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, onQuickAction, hasMessages = false }) => {
  const [input, setInput] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="border-t border-gray-200/80 bg-white/95 backdrop-blur-sm w-full">
      {/* Quick Actions - Centered Suggestions */}
      {!hasMessages && (
        <div className="py-6 px-4 md:px-8 lg:px-16 xl:px-24">
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
            {QUICK_ACTIONS.map((action, idx) => (
              <button
                key={idx}
                onClick={() => onQuickAction?.(action.query)}
                disabled={isLoading}
                className="group px-5 py-2.5 bg-white rounded-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-300 transition-all duration-200 whitespace-nowrap text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <span className="opacity-70 group-hover:opacity-100 transition-opacity">💡</span>
                  <span>{action.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form with advanced styling */}
      <form onSubmit={handleSubmit} className="p-4 px-4 md:px-8 lg:px-16 xl:px-24">
        <div className={`flex items-center gap-3 transition-all max-w-4xl mx-auto ${
          isFocused ? '' : ''
        }`}>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask me about properties..."
              disabled={isLoading}
              maxLength={500}
              className="w-full px-5 py-3.5 pr-16 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all text-gray-900 placeholder-gray-400 text-[15px] shadow-sm hover:shadow-md focus:shadow-lg"
            />
            {input.length > 0 && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <span className="text-xs text-gray-400 font-medium">
                  {input.length}/500
                </span>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-sm ${
              isLoading ? '' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Sending</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
