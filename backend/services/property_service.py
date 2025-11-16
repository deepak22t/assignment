"""Property data service for loading and merging property data"""
import json
import os
from typing import List, Dict, Optional, Callable, Any
from pathlib import Path
from models.schemas import PropertyFilterRequest, PropertyResponse
from config import DATA_DIR, DATA_FILES, FILTER_CONFIG, PROPERTY_FIELDS, FILTER_OPERATORS


class PropertyService:
    """Service for property data operations"""
    
    def __init__(self, data_dir: Optional[str] = None):
        """Initialize with configurable data directory"""
        self.data_dir = Path(data_dir) if data_dir else Path(DATA_DIR)
        self._properties_cache: Optional[List[Dict]] = None
    
    def load_json_data(self, filename: str) -> List[Dict]:
        """Load JSON data from file"""
        filepath = self.data_dir / filename
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"⚠️ File not found: {filepath}")
            return []
        except json.JSONDecodeError as e:
            print(f"⚠️ JSON decode error in {filename}: {e}")
            return []
    
    def merge_property_data(self, use_cache: bool = True) -> List[Dict]:
        """Merge data from all configured JSON files into a single list"""
        if use_cache and self._properties_cache is not None:
            return self._properties_cache
        
        basics = self.load_json_data(DATA_FILES["basics"])
        characteristics = self.load_json_data(DATA_FILES["characteristics"])
        images = self.load_json_data(DATA_FILES["images"])
        
        # Create lookup dictionaries for O(1) access
        char_dict = {item['id']: item for item in characteristics}
        img_dict = {item['id']: item for item in images}
        
        # Merge data
        merged = []
        for prop in basics:
            prop_id = prop['id']
            merged_prop = {
                **prop,
                **char_dict.get(prop_id, {}),
                'images': img_dict.get(prop_id, {}).get('images', [])
            }
            merged.append(merged_prop)
        
        if use_cache:
            self._properties_cache = merged
        
        return merged
    
    def _apply_filter(
        self,
        properties: List[Dict],
        field: str,
        value: Any,
        operator: str = "equals"
    ) -> List[Dict]:
        """Apply a single filter to properties"""
        if field not in PROPERTY_FIELDS:
            return properties
        
        actual_field = PROPERTY_FIELDS[field]
        filter_func = FILTER_OPERATORS.get(operator, FILTER_OPERATORS["equals"])
        
        filtered = []
        for prop in properties:
            prop_value = prop.get(actual_field)
            if prop_value is None:
                continue
            
            try:
                if filter_func(prop_value, value):
                    filtered.append(prop)
            except Exception as e:
                print(f"⚠️ Filter error for {field}: {e}")
                continue
        
        return filtered
    
    def filter_properties(
        self,
        properties: List[Dict],
        filter_params: PropertyFilterRequest
    ) -> List[Dict]:
        """Filter properties based on filter parameters using configurable logic"""
        filtered = properties.copy()
        
        # Build filter operations dynamically
        filters = []
        
        if filter_params.location:
            filters.append(("location", filter_params.location, "contains"))
        
        if filter_params.min_price is not None:
            filters.append(("price", filter_params.min_price, "min"))
        
        if filter_params.max_price is not None:
            filters.append(("price", filter_params.max_price, "max"))
        
        if filter_params.bedrooms is not None:
            filters.append(("bedrooms", filter_params.bedrooms, "equals"))
        
        if filter_params.bathrooms is not None:
            filters.append(("bathrooms", filter_params.bathrooms, "equals"))
        
        if filter_params.min_size is not None:
            filters.append(("size", filter_params.min_size, "min"))
        
        if filter_params.amenities:
            filters.append(("amenities", filter_params.amenities, "in"))
        
        # Apply all filters sequentially
        for field, value, operator in filters:
            filtered = self._apply_filter(filtered, field, value, operator)
        
        return filtered
    
    def get_property_by_id(self, property_id: int) -> Optional[Dict]:
        """Get a single property by ID"""
        properties = self.merge_property_data()
        return next((p for p in properties if p['id'] == property_id), None)
    
    def get_properties_by_ids(self, property_ids: List[int]) -> List[Dict]:
        """Get multiple properties by their IDs"""
        properties = self.merge_property_data()
        return [p for p in properties if p['id'] in property_ids]
    
    def search_properties(
        self,
        query: Optional[str] = None,
        filters: Optional[PropertyFilterRequest] = None,
        limit: Optional[int] = None,
        sort_by: Optional[str] = None,
        sort_order: str = "asc"
    ) -> List[Dict]:
        """Advanced search with query, filters, sorting, and pagination"""
        properties = self.merge_property_data()
        
        # Apply filters if provided
        if filters:
            properties = self.filter_properties(properties, filters)
        
        # Apply text search if query provided
        if query:
            query_lower = query.lower()
            properties = [
                p for p in properties
                if query_lower in str(p.get('title', '')).lower()
                or query_lower in str(p.get('location', '')).lower()
                or query_lower in str(p.get('amenities', [])).lower()
            ]
        
        # Apply sorting
        if sort_by and sort_by in PROPERTY_FIELDS:
            field = PROPERTY_FIELDS[sort_by]
            reverse = sort_order.lower() == "desc"
            properties = sorted(
                properties,
                key=lambda x: x.get(field, 0) if isinstance(x.get(field), (int, float)) else str(x.get(field, '')),
                reverse=reverse
            )
        
        # Apply limit
        limit = limit or FILTER_CONFIG["default_limit"]
        limit = min(limit, FILTER_CONFIG["max_limit"])
        
        return properties[:limit]
    
    def convert_to_property_response(self, property_dict: Dict) -> PropertyResponse:
        """Convert dictionary to PropertyResponse model"""
        return PropertyResponse(
            id=property_dict.get('id'),
            title=property_dict.get('title', ''),
            price=property_dict.get('price', 0),
            location=property_dict.get('location', ''),
            bedrooms=property_dict.get('bedrooms', 0),
            bathrooms=property_dict.get('bathrooms', 0),
            size=property_dict.get('size', 0),
            amenities=property_dict.get('amenities', []),
            images=property_dict.get('images', []),
            prediction=property_dict.get('prediction')
        )
    
    def clear_cache(self):
        """Clear the properties cache"""
        self._properties_cache = None


# Global instance (can be overridden for testing)
property_service = PropertyService()


# Convenience functions for backward compatibility
def merge_property_data() -> List[Dict]:
    """Convenience function for backward compatibility"""
    return property_service.merge_property_data()


def filter_properties(
    properties: List[Dict],
    filter_params: PropertyFilterRequest
) -> List[Dict]:
    """Convenience function for backward compatibility"""
    return property_service.filter_properties(properties, filter_params)


def get_property_by_id(property_id: int) -> Optional[Dict]:
    """Convenience function for backward compatibility"""
    return property_service.get_property_by_id(property_id)


def get_properties_by_ids(property_ids: List[int]) -> List[Dict]:
    """Convenience function for backward compatibility"""
    return property_service.get_properties_by_ids(property_ids)


def convert_to_property_response(property_dict: Dict) -> PropertyResponse:
    """Convenience function for backward compatibility"""
    return property_service.convert_to_property_response(property_dict)
