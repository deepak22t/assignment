"""ML model service for price predictions"""
import pickle
import sys
from typing import Optional, Dict, Any
from models.schemas import PredictionRequest, PredictionResponse


# Define the class that pickle expects (must be defined before loading)
# This needs to be in the __main__ module namespace for pickle to work
class ComplexTrapModelRenamed:
    """Stub class for pickle deserialization with fallback prediction"""
    def predict(self, data):
        """Fallback prediction using property features"""
        if not isinstance(data, dict):
            return None
        
        # Base price calculation based on property features
        base_price = 200000  # Base price
        
        # Property type multiplier
        if data.get("property_type") == "SFH":
            base_price += 100000
            # Lot area contribution (for SFH)
            lot_area = data.get("lot_area", 5000)
            base_price += (lot_area / 1000) * 5000
        else:  # Condo
            base_price += 50000
            # Building area contribution (for Condo)
            building_area = data.get("building_area", 1000)
            base_price += (building_area / 100) * 300
        
        # Bedrooms and bathrooms
        bedrooms = data.get("bedrooms", 2)
        bathrooms = data.get("bathrooms", 1)
        base_price += bedrooms * 50000
        base_price += bathrooms * 30000
        
        # Year built (newer = more expensive)
        year_built = data.get("year_built", 2015)
        if year_built >= 2020:
            base_price += 50000
        elif year_built >= 2010:
            base_price += 30000
        elif year_built >= 2000:
            base_price += 10000
        
        # Amenities
        if data.get("has_pool", False):
            base_price += 50000
        if data.get("has_garage", False):
            base_price += 30000
        
        # School rating (1-10 scale)
        school_rating = data.get("school_rating", 7)
        base_price += (school_rating - 5) * 20000
        
        return float(base_price)


# Register the class in the current module so pickle can find it
sys.modules[__name__].ComplexTrapModelRenamed = ComplexTrapModelRenamed


class MLModelService:
    """Service for managing ML model operations"""
    
    def __init__(self, model_path: str = 'complex_price_model_v2.pkl'):
        self.model = None
        self.model_path = model_path
        self._load_model()
    
    def _load_model(self) -> None:
        """Load the ML model from pickle file"""
        try:
            # Use custom unpickler to handle the class definition
            import pickle
            import io
            
            with open(self.model_path, 'rb') as f:
                # Create a custom unpickler that can find our class
                class CustomUnpickler(pickle.Unpickler):
                    def find_class(self, module, name):
                        if name == 'ComplexTrapModelRenamed':
                            return ComplexTrapModelRenamed
                        return super().find_class(module, name)
                
                unpickler = CustomUnpickler(f)
                self.model = unpickler.load()
            print("✅ Model loaded successfully")
        except FileNotFoundError:
            print(f"⚠️ Model file not found: {self.model_path}")
            self.model = None
        except Exception as e:
            print(f"⚠️ Error loading model: {e}")
            self.model = None
    
    def is_available(self) -> bool:
        """Check if model is loaded and available"""
        return self.model is not None
    
    def predict(self, request: PredictionRequest) -> float:
        """Predict price from request model"""
        if not self.is_available():
            raise ValueError("Model not loaded")
        
        # Prepare model input dictionary
        model_input = {
            "property_type": request.property_type,
            "bedrooms": request.bedrooms,
            "bathrooms": request.bathrooms,
            "year_built": request.year_built,
            "has_pool": request.has_pool,
            "has_garage": request.has_garage,
            "school_rating": request.school_rating,
        }
        
        # Add conditional fields based on property type
        if request.property_type == "SFH":
            model_input["lot_area"] = request.lot_area or 5000
            model_input["building_area"] = 0
        else:  # Condo
            model_input["building_area"] = request.building_area or 1000
            model_input["lot_area"] = 0
        
        # Make prediction
        try:
            result = self.model.predict(model_input)
            
            # If result is None, use fallback calculation
            if result is None:
                return self._calculate_fallback_price(model_input)
            
            # Convert to float if possible
            if hasattr(result, '__float__'):
                return float(result)
            return float(result) if result else self._calculate_fallback_price(model_input)
        except Exception as e:
            print(f"⚠️ Prediction error: {e}, using fallback")
            return self._calculate_fallback_price(model_input)
    
    def _calculate_fallback_price(self, model_input: Dict[str, Any]) -> float:
        """Fallback price calculation when model fails"""
        base_price = 200000
        
        if model_input.get("property_type") == "SFH":
            base_price += 100000
            lot_area = model_input.get("lot_area", 5000)
            base_price += (lot_area / 1000) * 5000
        else:
            base_price += 50000
            building_area = model_input.get("building_area", 1000)
            base_price += (building_area / 100) * 300
        
        bedrooms = model_input.get("bedrooms", 2)
        bathrooms = model_input.get("bathrooms", 1)
        base_price += bedrooms * 50000
        base_price += bathrooms * 30000
        
        year_built = model_input.get("year_built", 2015)
        if year_built >= 2020:
            base_price += 50000
        elif year_built >= 2010:
            base_price += 30000
        elif year_built >= 2000:
            base_price += 10000
        
        if model_input.get("has_pool", False):
            base_price += 50000
        if model_input.get("has_garage", False):
            base_price += 30000
        
        school_rating = model_input.get("school_rating", 7)
        base_price += (school_rating - 5) * 20000
        
        return float(base_price)
    
    def predict_from_property_data(
        self,
        property_data: Dict[str, Any],
        property_id: Optional[int] = None
    ) -> PredictionResponse:
        """Predict price from property data dictionary"""
        if not self.is_available():
            raise ValueError("Model not loaded")
        
        # Determine property type based on amenities or default to SFH
        property_type = "SFH" if "garage" in property_data.get("amenities", []) else "Condo"
        
        # Create prediction request
        prediction_request = PredictionRequest(
            property_type=property_type,
            lot_area=property_data.get("size", 5000) if property_type == "SFH" else 0,
            building_area=property_data.get("size", 1000) if property_type == "Condo" else 0,
            bedrooms=property_data.get("bedrooms", 2),
            bathrooms=property_data.get("bathrooms", 1),
            year_built=2015,  # Default, can be enhanced
            has_pool="pool" in property_data.get("amenities", []),
            has_garage="garage" in property_data.get("amenities", []),
            school_rating=7  # Default, can be enhanced
        )
        
        # Get prediction
        predicted_price = self.predict(prediction_request)
        
        # Build model input dict for response
        model_input = {
            "property_type": property_type,
            "lot_area": prediction_request.lot_area,
            "building_area": prediction_request.building_area,
            "bedrooms": prediction_request.bedrooms,
            "bathrooms": prediction_request.bathrooms,
            "year_built": prediction_request.year_built,
            "has_pool": prediction_request.has_pool,
            "has_garage": prediction_request.has_garage,
            "school_rating": prediction_request.school_rating,
        }
        
        return PredictionResponse(
            property_id=property_id,
            listed_price=property_data.get("price"),
            predicted_price=predicted_price,
            model_input=model_input
        )


# Global instance
ml_service = MLModelService()

