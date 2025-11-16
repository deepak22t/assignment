"""
MongoDB service for storing saved properties
Optional: Can be enabled by setting MONGODB_URI environment variable
"""
from pymongo import MongoClient
from typing import List, Optional
import os

class MongoDBService:
    def __init__(self):
        self.mongodb_uri = os.getenv('MONGODB_URI')
        self.client = None
        self.db = None
        
        if self.mongodb_uri:
            try:
                self.client = MongoClient(self.mongodb_uri)
                self.db = self.client['real_estate_db']
                print("✅ Connected to MongoDB")
            except Exception as e:
                print(f"⚠️ MongoDB connection error: {e}")
                self.client = None
    
    def is_available(self) -> bool:
        return self.client is not None
    
    def save_property(self, user_id: str, property_id: int) -> bool:
        """Save a property for a user"""
        if not self.is_available():
            return False
        
        try:
            collection = self.db['saved_properties']
            collection.update_one(
                {'user_id': user_id, 'property_id': property_id},
                {'$set': {'user_id': user_id, 'property_id': property_id}},
                upsert=True
            )
            return True
        except Exception as e:
            print(f"Error saving property: {e}")
            return False
    
    def get_saved_properties(self, user_id: str) -> List[int]:
        """Get list of saved property IDs for a user"""
        if not self.is_available():
            return []
        
        try:
            collection = self.db['saved_properties']
            results = collection.find({'user_id': user_id})
            return [doc['property_id'] for doc in results]
        except Exception as e:
            print(f"Error getting saved properties: {e}")
            return []
    
    def remove_saved_property(self, user_id: str, property_id: int) -> bool:
        """Remove a saved property"""
        if not self.is_available():
            return False
        
        try:
            collection = self.db['saved_properties']
            collection.delete_one({'user_id': user_id, 'property_id': property_id})
            return True
        except Exception as e:
            print(f"Error removing saved property: {e}")
            return False
    
    def save_chat_message(self, user_id: str, message: dict) -> bool:
        """Save a chat message to history"""
        if not self.is_available():
            return False
        
        try:
            collection = self.db['chat_history']
            message['user_id'] = user_id
            collection.insert_one(message)
            return True
        except Exception as e:
            print(f"Error saving chat message: {e}")
            return False
    
    def get_chat_history(self, user_id: str) -> List[dict]:
        """Get chat history for a user"""
        if not self.is_available():
            return []
        
        try:
            collection = self.db['chat_history']
            results = collection.find(
                {'user_id': user_id},
                sort=[('timestamp', 1)]  # Sort by timestamp ascending
            )
            # Remove MongoDB _id field and return as list
            return [{k: v for k, v in doc.items() if k != '_id'} for doc in results]
        except Exception as e:
            print(f"Error getting chat history: {e}")
            return []
    
    def clear_chat_history(self, user_id: str) -> bool:
        """Clear chat history for a user"""
        if not self.is_available():
            return False
        
        try:
            collection = self.db['chat_history']
            collection.delete_many({'user_id': user_id})
            return True
        except Exception as e:
            print(f"Error clearing chat history: {e}")
            return False

# Global instance
mongodb_service = MongoDBService()

