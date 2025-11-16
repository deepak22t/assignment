/**
 * TypeScript type definitions
 */

export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  amenities: string[];
  images: string[];
  prediction?: {
    predicted_price: number;
    listed_price?: number;
    model_input?: any;
  };
}

export interface Message {
  id: number | string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  properties?: Property[];
  isError?: boolean;
}

export interface ChatResponse {
  message: string;
  properties: Property[];
  suggestions: string[];
}

export interface PropertyFilter {
  location?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  min_size?: number;
  amenities?: string[];
}

export interface SavePropertyRequest {
  property_id: number;
  user_id?: string;
}

export interface ComparisonResponse {
  property1: Property & { prediction?: any };
  property2: Property & { prediction?: any };
}

export interface QuickAction {
  label: string;
  query: string;
}

