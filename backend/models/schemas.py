"""Pydantic schemas for request and response models"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


# Property Models
class PropertyBase(BaseModel):
    """Base property model"""
    id: int
    title: str
    price: float
    location: str


class PropertyCharacteristics(BaseModel):
    """Property characteristics"""
    bedrooms: int
    bathrooms: int
    size: int
    amenities: List[str] = Field(default_factory=list)


class PropertyImage(BaseModel):
    """Property image model"""
    images: List[str] = Field(default_factory=list)


class Property(PropertyBase, PropertyCharacteristics, PropertyImage):
    """Complete property model with all merged data"""
    pass


# Request Models
class ChatMessageRequest(BaseModel):
    """Request model for chatbot endpoint"""
    message: str = Field(..., description="User's chat message")
    user_id: Optional[str] = Field("default", description="User ID for chat history")
    preferences: Optional[Dict[str, Any]] = Field(None, description="Optional user preferences")


class PropertyFilterRequest(BaseModel):
    """Request model for property search/filter"""
    location: Optional[str] = Field(None, description="Filter by location")
    min_price: Optional[int] = Field(None, ge=0, description="Minimum price")
    max_price: Optional[int] = Field(None, ge=0, description="Maximum price")
    bedrooms: Optional[int] = Field(None, ge=0, description="Minimum number of bedrooms")
    bathrooms: Optional[int] = Field(None, ge=0, description="Minimum number of bathrooms")
    min_size: Optional[int] = Field(None, ge=0, description="Minimum property size in sqft")
    amenities: Optional[List[str]] = Field(None, description="Required amenities")


class SavePropertyRequest(BaseModel):
    """Request model for saving a property"""
    property_id: int = Field(..., gt=0, description="Property ID to save")
    user_id: Optional[str] = Field("default", description="User ID")


class ComparePropertiesRequest(BaseModel):
    """Request model for comparing properties"""
    property_ids: List[int] = Field(..., min_items=2, max_items=2, description="Exactly 2 property IDs to compare")


class PredictionRequest(BaseModel):
    """Request model for ML price prediction"""
    property_type: str = Field(..., pattern="^(SFH|Condo)$", description="Property type: SFH or Condo")
    lot_area: Optional[int] = Field(None, ge=0, description="Lot area (required for SFH)")
    building_area: Optional[int] = Field(None, ge=0, description="Building area (required for Condo)")
    bedrooms: int = Field(..., ge=0, description="Number of bedrooms")
    bathrooms: int = Field(..., ge=0, description="Number of bathrooms")
    year_built: int = Field(..., ge=1800, le=2024, description="Year built")
    has_pool: bool = Field(False, description="Has pool")
    has_garage: bool = Field(False, description="Has garage")
    school_rating: int = Field(..., ge=1, le=10, description="School rating (1-10)")


# Response Models
class PropertyResponse(BaseModel):
    """Response model for single property"""
    id: int
    title: str
    price: float
    location: str
    bedrooms: int
    bathrooms: int
    size: int
    amenities: List[str]
    images: List[str]
    prediction: Optional[Dict[str, Any]] = Field(None, description="ML price prediction data")


class PropertiesListResponse(BaseModel):
    """Response model for list of properties"""
    properties: List[PropertyResponse]
    count: int


class ChatResponse(BaseModel):
    """Response model for chatbot endpoint"""
    message: str
    properties: List[PropertyResponse] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)


class PredictionResponse(BaseModel):
    """Response model for price prediction"""
    property_id: Optional[int] = None
    listed_price: Optional[float] = None
    predicted_price: float
    model_input: Optional[Dict[str, Any]] = None


class SavePropertyResponse(BaseModel):
    """Response model for saving property"""
    message: str
    saved_properties: List[int]
    storage: str = Field(..., description="Storage type: 'mongodb' or 'memory'")


class SavedPropertiesResponse(BaseModel):
    """Response model for getting saved properties"""
    properties: List[PropertyResponse]
    count: int


class ComparisonResponse(BaseModel):
    """Response model for property comparison"""
    property1: Dict[str, Any] = Field(..., description="First property with prediction")
    property2: Dict[str, Any] = Field(..., description="Second property with prediction")


class HealthResponse(BaseModel):
    """Response model for health check"""
    message: str
    status: str


class ChatMessage(BaseModel):
    """Chat message model"""
    id: str
    type: str = Field(..., description="Message type: 'user' or 'bot'")
    text: str
    timestamp: str
    properties: Optional[List[PropertyResponse]] = Field(default_factory=list)
    isError: Optional[bool] = False


class ChatHistoryResponse(BaseModel):
    """Response model for chat history"""
    messages: List[ChatMessage]
    count: int

