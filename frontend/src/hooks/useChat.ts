/**
 * Custom hook for chat functionality
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { chatAPI } from '../services/api';
import { Message, Property } from '../types';

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (messageText: string) => Promise<void>;
  clearChat: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const USER_ID = 'default'; // Can be changed to use actual user ID later

export const useChat = (
  onPropertiesFound?: (properties: Property[]) => void,
  onViewProperties?: () => void
): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const response = await chatAPI.getHistory(USER_ID);
        const historyMessages: Message[] = response.data.messages.map((msg) => ({
          id: msg.id,
          type: msg.type,
          text: msg.text,
          timestamp: new Date(msg.timestamp),
          properties: msg.properties || [],
          isError: msg.isError || false,
        }));
        setMessages(historyMessages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        // Continue with empty messages if history fetch fails
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!isLoadingHistory) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom, isLoadingHistory]);

  const sendMessage = useCallback(async (messageText: string): Promise<void> => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      text: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(messageText, USER_ID);
      const botResponse = response.data;

      const botMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        text: botResponse.message || 'I found some properties for you!',
        properties: botResponse.properties || [],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      if (botResponse.properties && botResponse.properties.length > 0) {
        onPropertiesFound?.(botResponse.properties);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, onPropertiesFound]);

  const clearChat = useCallback(async () => {
    try {
      await chatAPI.clearHistory(USER_ID);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      // Still clear local state even if API call fails
      setMessages([]);
    }
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    messagesEndRef,
  };
};

