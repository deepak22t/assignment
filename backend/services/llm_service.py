"""LLM service for natural language processing"""
import os
import json
from typing import Dict, Optional, Any
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    """Service for LLM-based intent detection and response generation"""
    
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            try:
                # Initialize OpenAI client with error handling
                self.client = OpenAI(api_key=api_key)
                self.enabled = True
            except Exception as e:
                print(f"⚠️ Failed to initialize OpenAI client: {e}")
                self.client = None
                self.enabled = False
        else:
            self.client = None
            self.enabled = False
            print("⚠️ OpenAI API key not found. LLM features disabled.")
    
    def extract_preferences(self, user_message: str) -> Dict[str, Any]:
        """Use LLM to extract property search preferences from user message"""
        if not self.enabled:
            return {}
        
        try:
            prompt = f"""Extract property search preferences from this user message. Return ONLY a valid JSON object with these fields:
- location: string or null (city name if mentioned)
- max_price: number or null (maximum budget if mentioned)
- min_price: number or null (minimum budget if mentioned)
- bedrooms: number or null (number of bedrooms if mentioned)
- bathrooms: number or null (number of bathrooms if mentioned)
- amenities: array of strings or null (amenities like pool, garage, gym, etc.)
- sort_by: string or null ("price_asc" for cheapest/lowest, "price_desc" for most expensive/highest, or null)
- property_name: string or null (specific property title/name if user is asking about a particular property, e.g., "Penthouse with Panoramic Views", "Luxury Condo", etc.)

User message: "{user_message}"

Return ONLY the JSON object, no other text:"""

            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that extracts property search preferences. Always return valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=200
            )
            
            content = response.choices[0].message.content.strip()
            # Remove markdown code blocks if present
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
                content = content.strip()
            
            preferences = json.loads(content)
            return preferences
            
        except Exception as e:
            print(f"⚠️ LLM extraction error: {e}")
            return {}
    
    def extract_property_name(self, user_message: str) -> Optional[str]:
        """Use LLM to extract specific property name/title from user message"""
        if not self.enabled:
            return None
        
        try:
            prompt = f"""Extract the specific property name or title that the user is asking about from this message. 
If the user is asking about a specific property (e.g., "show me Luxury Condo", "details of Penthouse with Panoramic Views", "I want more info about Modern Family Home"), 
return ONLY the property name/title as a string. 
If no specific property is mentioned, return null.

Examples:
- "show me Luxury Condo" -> "Luxury Condo"
- "yes i want more details of Penthouse with Panoramic Views" -> "Penthouse with Panoramic Views"
- "tell me about Modern Family Home" -> "Modern Family Home"
- "show me properties under 500k" -> null
- "find 3 bedroom houses" -> null

User message: "{user_message}"

Return ONLY the property name as a string, or null if no specific property is mentioned. No other text:"""

            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that extracts property names from user messages. Return only the property name or null."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=50
            )
            
            content = response.choices[0].message.content.strip().strip('"').strip("'")
            
            # Check if it's null or empty
            if content.lower() in ["null", "none", ""]:
                return None
            
            return content
            
        except Exception as e:
            print(f"⚠️ LLM property name extraction error: {e}")
            return None
    
    def generate_response(
        self,
        user_message: str,
        properties: list,
        preferences: Dict[str, Any]
    ) -> str:
        """Use LLM to generate a natural, conversational response"""
        if not self.enabled:
            return self._fallback_response(properties, preferences)
        
        try:
            # Prepare property summary for LLM
            property_summary = []
            for prop in properties[:5]:
                prop_info = f"- {prop.get('title', 'Property')} in {prop.get('location', 'Unknown')}: ${prop.get('price', 0):,.0f}, {prop.get('bedrooms', 0)} bed, {prop.get('bathrooms', 0)} bath"
                property_summary.append(prop_info)
            
            properties_text = "\n".join(property_summary) if property_summary else "No properties found."
            
            prompt = f"""You are a friendly real estate assistant chatbot. Generate a natural, conversational response to the user.

User's query: "{user_message}"

User's preferences detected: {json.dumps(preferences, indent=2)}

Properties found ({len(properties)}):
{properties_text}

Generate a friendly, helpful response that:
1. Acknowledges what the user is looking for
2. Mentions the properties found (if any)
3. Provides helpful information about prices, locations, or features
4. Is conversational and natural, like talking to a helpful agent
5. Keep it concise (2-3 sentences max)

Response:"""

            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a friendly, helpful real estate assistant. Be conversational and natural."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=300
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"⚠️ LLM response generation error: {e}")
            return self._fallback_response(properties, preferences)
    
    def _fallback_response(self, properties: list, preferences: Dict[str, Any]) -> str:
        """Fallback response when LLM is not available"""
        if not properties:
            return "I couldn't find properties matching your criteria. Try adjusting your search parameters."
        
        count = len(properties)
        cheapest = min(properties, key=lambda x: x.get('price', float('inf')))
        
        return f"I found {count} properties for you. The most affordable option is {cheapest.get('title', 'a property')} at ${cheapest.get('price', 0):,.0f}."


# Global instance
llm_service = LLMService()

