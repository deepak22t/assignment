"""Property-related API routes"""
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from models.schemas import (
    PropertyFilterRequest,
    PropertiesListResponse,
    PropertyResponse,
    SavePropertyRequest,
    SavePropertyResponse,
    SavedPropertiesResponse,
    ComparePropertiesRequest,
    ComparisonResponse
)
from services.property_service import property_service
from services.ml_service import ml_service
from mongodb_service import mongodb_service

router = APIRouter(prefix="/api/properties", tags=["properties"])

# In-memory fallback for saved properties (used if MongoDB not available)
saved_properties = {}


@router.get("", response_model=PropertiesListResponse)
async def get_all_properties():
    """Get all merged properties"""
    properties = property_service.merge_property_data()
    property_responses = [
        property_service.convert_to_property_response(prop) for prop in properties
    ]
    return PropertiesListResponse(
        properties=property_responses,
        count=len(property_responses)
    )


@router.post("/search", response_model=PropertiesListResponse)
async def search_properties(filter_params: PropertyFilterRequest):
    """Search and filter properties based on user preferences"""
    filtered = property_service.search_properties(filters=filter_params)
    
    property_responses = [
        property_service.convert_to_property_response(prop) for prop in filtered
    ]
    
    return PropertiesListResponse(
        properties=property_responses,
        count=len(property_responses)
    )


@router.post("/save", response_model=SavePropertyResponse)
async def save_property(request: SavePropertyRequest):
    """Save a property to user's favorites"""
    user_id = request.user_id
    
    # Try MongoDB first, fallback to in-memory
    if mongodb_service.is_available():
        success = mongodb_service.save_property(user_id, request.property_id)
        if success:
            saved_ids = mongodb_service.get_saved_properties(user_id)
            return SavePropertyResponse(
                message="Property saved",
                saved_properties=saved_ids,
                storage="mongodb"
            )
    
    # Fallback to in-memory storage
    if user_id not in saved_properties:
        saved_properties[user_id] = []
    
    if request.property_id not in saved_properties[user_id]:
        saved_properties[user_id].append(request.property_id)
    
    return SavePropertyResponse(
        message="Property saved",
        saved_properties=saved_properties[user_id],
        storage="memory"
    )


@router.get("/saved/{user_id}", response_model=SavedPropertiesResponse)
async def get_saved_properties(user_id: str = "default"):
    """Get user's saved properties"""
    # Try MongoDB first, fallback to in-memory
    property_ids = []
    if mongodb_service.is_available():
        property_ids = mongodb_service.get_saved_properties(user_id)
    else:
        if user_id in saved_properties:
            property_ids = saved_properties[user_id]
    
    if not property_ids:
        return SavedPropertiesResponse(properties=[], count=0)
    
    saved_props = property_service.get_properties_by_ids(property_ids)
    
    property_responses = [
        property_service.convert_to_property_response(prop) for prop in saved_props
    ]
    
    return SavedPropertiesResponse(
        properties=property_responses,
        count=len(property_responses)
    )


@router.post("/compare", response_model=ComparisonResponse)
async def compare_properties(request: ComparePropertiesRequest):
    """Compare two properties side-by-side"""
    property_ids = request.property_ids
    
    if len(property_ids) != 2:
        raise HTTPException(
            status_code=400,
            detail="Please provide exactly 2 property IDs"
        )
    
    properties = property_service.get_properties_by_ids(property_ids)
    
    if len(properties) != 2:
        raise HTTPException(
            status_code=404,
            detail="One or more properties not found"
        )
    
    # Get predictions for both properties
    predictions = []
    for prop in properties:
        try:
            pred_response = ml_service.predict_from_property_data(
                prop,
                property_id=prop['id']
            )
            predictions.append(pred_response)
        except Exception as e:
            # Create a prediction response with None if prediction fails
            from models.schemas import PredictionResponse
            predictions.append(
                PredictionResponse(
                    property_id=prop['id'],
                    predicted_price=0.0,
                    listed_price=prop.get('price')
                )
            )
    
    # Combine properties with predictions
    prop1_dict = {**properties[0], "prediction": predictions[0].model_dump()}
    prop2_dict = {**properties[1], "prediction": predictions[1].model_dump()}
    
    return ComparisonResponse(
        property1=prop1_dict,
        property2=prop2_dict
    )

