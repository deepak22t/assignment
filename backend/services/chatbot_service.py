"""Chatbot service using LLM for natural language processing"""
from typing import Dict, List
from datetime import datetime
from models.schemas import PropertyFilterRequest, ChatResponse, PropertyResponse
from services.property_service import property_service
from services.llm_service import llm_service
from services.ml_service import ml_service
from mongodb_service import mongodb_service


class ChatbotService:
    """Service for chatbot functionality using LLM"""
    
    def __init__(self):
        self.property_service = property_service
        # In-memory fallback for chat history (used if MongoDB not available)
        self.memory_history: Dict[str, List[dict]] = {}
    
    def _wants_prediction(self, message: str) -> bool:
        """Check if user wants price predictions"""
        prediction_keywords = [
            'predict', 'prediction', 'estimate', 'estimated', 'ml', 'machine learning',
            'ai price', 'predicted price', 'what is the price', 'how much', 'value',
            'worth', 'appraisal', 'evaluate'
        ]
        message_lower = message.lower()
        return any(keyword in message_lower for keyword in prediction_keywords)
    
    def _is_greeting(self, message: str) -> bool:
        """Check if the message is just a greeting"""
        greeting_words = [
            'hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon',
            'good evening', 'hi there', 'hello there', 'hey there', 'hii', 'hiii',
            'hiiii', 'hiiiii', 'hola', 'namaste', 'howdy', 'sup', 'what\'s up',
            'whats up', 'yo', 'greeting', 'greet'
        ]
        message_lower = message.lower().strip()
        # Remove punctuation
        message_clean = ''.join(c for c in message_lower if c.isalnum() or c.isspace())
        words = message_clean.split()
        
        # Check if message is just greeting words (max 3 words)
        if len(words) <= 3:
            if any(word in greeting_words for word in words):
                return True
        
        return False
    
    def process_message(self, message: str, user_id: str = "default") -> ChatResponse:
        """Process user message using LLM and return property recommendations"""
        # Check if it's just a greeting
        if self._is_greeting(message):
            greeting_response = (
                "Hello! 👋 I'm your Real Estate AI assistant. "
                "I can help you find properties based on your preferences like location, price, bedrooms, and amenities. "
                "Try asking me something like 'Show me properties under $500,000' or 'Find 3 bedroom houses in San Francisco'."
            )
            
            # Store user message
            user_msg = {
                "id": str(int(datetime.now().timestamp() * 1000)),
                "type": "user",
                "text": message,
                "timestamp": datetime.now().isoformat(),
            }
            self._save_message(user_id, user_msg)
            
            # Store bot greeting response
            bot_msg = {
                "id": str(int(datetime.now().timestamp() * 1000) + 1),
                "type": "bot",
                "text": greeting_response,
                "timestamp": datetime.now().isoformat(),
                "properties": [],
            }
            self._save_message(user_id, bot_msg)
            
            return ChatResponse(
                message=greeting_response,
                properties=[],
                suggestions=self._generate_suggestions()
            )
        
        # Step 1: Use LLM to extract preferences and property name from user message
        preferences = llm_service.extract_preferences(message)
        
        # Step 2: Extract specific property name using LLM (if user is asking about a specific property)
        property_name_query = llm_service.extract_property_name(message)
        
        # Also check if property_name was extracted in preferences (fallback)
        if not property_name_query and preferences.get("property_name"):
            property_name_query = preferences.get("property_name")
        
        # Step 3: Convert LLM preferences to filter request
        filter_request = self._preferences_to_filter(preferences)
        
        # Step 4: Search properties using the service (handles filtering, sorting, limiting)
        sort_by = None
        sort_order = "asc"
        
        if preferences.get("sort_by") == "price_asc":
            sort_by = "price"
            sort_order = "asc"
        elif preferences.get("sort_by") == "price_desc":
            sort_by = "price"
            sort_order = "desc"
        
        properties = self.property_service.search_properties(
            query=property_name_query,  # Pass property name query for text search
            filters=filter_request,
            sort_by=sort_by,
            sort_order=sort_order,
            limit=100  # Use max limit to return all matching properties
        )
        
        # Step 5: Check if user wants price predictions
        wants_prediction = self._wants_prediction(message)
        
        # Step 6: Add predictions to properties if requested or if properties are shown
        if wants_prediction or (properties and len(properties) <= 3):
            # Add predictions to properties
            for prop in properties:
                try:
                    if ml_service.is_available():
                        prediction = ml_service.predict_from_property_data(prop, property_id=prop.get('id'))
                        prop['prediction'] = {
                            'predicted_price': prediction.predicted_price,
                            'listed_price': prediction.listed_price,
                            'model_input': prediction.model_input
                        }
                except Exception as e:
                    print(f"⚠️ Prediction error for property {prop.get('id')}: {e}")
                    # Continue without prediction
        
        # Step 7: Use LLM to generate natural conversational response
        response_message = llm_service.generate_response(message, properties, preferences)
        
        # Convert to PropertyResponse models
        property_responses = [
            self.property_service.convert_to_property_response(prop) for prop in properties
        ]
        
        # Store user message
        user_msg = {
            "id": str(int(datetime.now().timestamp() * 1000)),
            "type": "user",
            "text": message,
            "timestamp": datetime.now().isoformat(),
        }
        self._save_message(user_id, user_msg)
        
        # Store bot response
        bot_msg = {
            "id": str(int(datetime.now().timestamp() * 1000) + 1),
            "type": "bot",
            "text": response_message,
            "timestamp": datetime.now().isoformat(),
            "properties": [prop.dict() for prop in property_responses],
        }
        self._save_message(user_id, bot_msg)
        
        return ChatResponse(
            message=response_message,
            properties=property_responses,
            suggestions=self._generate_suggestions()
        )
    
    def _save_message(self, user_id: str, message: dict):
        """Save message to history (MongoDB or memory)"""
        if mongodb_service.is_available():
            mongodb_service.save_chat_message(user_id, message)
        else:
            # In-memory fallback
            if user_id not in self.memory_history:
                self.memory_history[user_id] = []
            self.memory_history[user_id].append(message)
    
    def get_chat_history(self, user_id: str = "default") -> List[dict]:
        """Get chat history for a user"""
        if mongodb_service.is_available():
            return mongodb_service.get_chat_history(user_id)
        else:
            # In-memory fallback
            return self.memory_history.get(user_id, [])
    
    def clear_chat_history(self, user_id: str = "default") -> bool:
        """Clear chat history for a user"""
        if mongodb_service.is_available():
            return mongodb_service.clear_chat_history(user_id)
        else:
            # In-memory fallback
            if user_id in self.memory_history:
                self.memory_history[user_id] = []
                return True
            return False
    
    def _preferences_to_filter(self, preferences: Dict) -> PropertyFilterRequest:
        """Convert LLM-extracted preferences to PropertyFilterRequest"""
        filter_dict = {}
        
        if preferences.get("location"):
            filter_dict["location"] = preferences["location"]
        
        if preferences.get("min_price"):
            filter_dict["min_price"] = preferences["min_price"]
        
        if preferences.get("max_price"):
            filter_dict["max_price"] = preferences["max_price"]
        
        if preferences.get("bedrooms"):
            filter_dict["bedrooms"] = preferences["bedrooms"]
        
        if preferences.get("bathrooms"):
            filter_dict["bathrooms"] = preferences["bathrooms"]
        
        if preferences.get("amenities"):
            filter_dict["amenities"] = preferences["amenities"]
        
        # Return None if no filters, otherwise create filter request
        if not filter_dict:
            return None
        
        return PropertyFilterRequest(**filter_dict)
    
    def _generate_suggestions(self) -> List[str]:
        """Generate helpful suggestions for the user"""
        return [
            "Try: 'Show me cheapest properties in San Francisco'",
            "Ask: 'Find 3 bedroom houses under $500,000'",
            "Say: 'I need a place with pool and garage'",
            "Query: 'Most expensive properties available'"
        ]


# Global instance
chatbot_service = ChatbotService()
