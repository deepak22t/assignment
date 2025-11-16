/**
 * API service for backend communication
 */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Property, ChatResponse, PropertyFilter, ComparisonResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

interface PropertiesResponse {
  properties: Property[];
  count: number;
}

interface SavedPropertiesResponse {
  properties: Property[];
  count: number;
}

interface SavePropertyResponse {
  message: string;
  saved_properties: number[];
  storage: string;
}

export const propertyAPI = {
  getAll: (): Promise<AxiosResponse<PropertiesResponse>> => 
    api.get('/api/properties'),
  
  search: (filters: PropertyFilter): Promise<AxiosResponse<PropertiesResponse>> => 
    api.post('/api/properties/search', filters),
  
  save: (propertyId: number, userId: string = 'default'): Promise<AxiosResponse<SavePropertyResponse>> =>
    api.post('/api/properties/save', { property_id: propertyId, user_id: userId }),
  
  getSaved: (userId: string = 'default'): Promise<AxiosResponse<SavedPropertiesResponse>> => 
    api.get(`/api/properties/saved/${userId}`),
  
  compare: (propertyIds: number[]): Promise<AxiosResponse<ComparisonResponse>> => 
    api.post('/api/properties/compare', { property_ids: propertyIds }),
  
  predict: (propertyId: number): Promise<AxiosResponse<any>> => 
    api.post(`/api/properties/${propertyId}/predict`),
};

interface ChatHistoryResponse {
  messages: Array<{
    id: string;
    type: 'user' | 'bot';
    text: string;
    timestamp: string;
    properties?: Property[];
    isError?: boolean;
  }>;
  count: number;
}

export const chatAPI = {
  sendMessage: (message: string, userId: string = 'default'): Promise<AxiosResponse<ChatResponse>> => 
    api.post('/api/chat', { message, user_id: userId }),
  
  getHistory: (userId: string = 'default'): Promise<AxiosResponse<ChatHistoryResponse>> =>
    api.get(`/api/chat/history/${userId}`),
  
  clearHistory: (userId: string = 'default'): Promise<AxiosResponse<{ success: boolean; message: string }>> =>
    api.delete(`/api/chat/history/${userId}`),
};

export default api;

