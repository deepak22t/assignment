"""ML prediction API routes"""
from fastapi import APIRouter, HTTPException
from models.schemas import (
    PredictionRequest,
    PredictionResponse
)
from services.ml_service import ml_service
from services.property_service import property_service

router = APIRouter(prefix="/api", tags=["predictions"])


@router.post("/predict", response_model=PredictionResponse)
async def predict_price(request: PredictionRequest):
    """Predict price using ML model with full request payload"""
    if not ml_service.is_available():
        raise HTTPException(
            status_code=500,
            detail="Model not loaded"
        )
    
    try:
        predicted_price = ml_service.predict(request)
        return PredictionResponse(predicted_price=predicted_price)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction error: {str(e)}"
        )


@router.post("/properties/{property_id}/predict", response_model=PredictionResponse)
async def predict_property_price(property_id: int):
    """Predict price for a specific property using its characteristics"""
    if not ml_service.is_available():
        raise HTTPException(
            status_code=500,
            detail="Model not loaded"
        )
    
    property_data = property_service.get_property_by_id(property_id)
    
    if not property_data:
        raise HTTPException(
            status_code=404,
            detail="Property not found"
        )
    
    try:
        prediction_response = ml_service.predict_from_property_data(
            property_data,
            property_id=property_id
        )
        return prediction_response
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction error: {str(e)}"
        )

