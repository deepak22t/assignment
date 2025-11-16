"""Configuration settings for the application"""
import os
from pathlib import Path
from typing import List, Dict

# Base directory
BASE_DIR = Path(__file__).parent

# Data directory configuration
DATA_DIR = os.getenv("DATA_DIR", str(BASE_DIR / "data"))
DATA_FILES = {
    "basics": os.getenv("PROPERTY_BASICS_FILE", "property_basics.json"),
    "characteristics": os.getenv("PROPERTY_CHARACTERISTICS_FILE", "property_characteristics.json"),
    "images": os.getenv("PROPERTY_IMAGES_FILE", "property_images.json"),
}

# Property filtering configuration
FILTER_CONFIG = {
    "default_limit": int(os.getenv("DEFAULT_PROPERTY_LIMIT", "5")),
    "max_limit": int(os.getenv("MAX_PROPERTY_LIMIT", "100")),
    "case_sensitive_location": os.getenv("CASE_SENSITIVE_LOCATION", "false").lower() == "true",
}

# Property field mappings (for flexible filtering)
PROPERTY_FIELDS = {
    "location": "location",
    "price": "price",
    "bedrooms": "bedrooms",
    "bathrooms": "bathrooms",
    "size": "size",
    "amenities": "amenities",
}

# Comparison operators for filtering
FILTER_OPERATORS = {
    "min": lambda value, threshold: value >= threshold,
    "max": lambda value, threshold: value <= threshold,
    "equals": lambda value, threshold: value == threshold,
    "contains": lambda value, threshold: threshold.lower() in str(value).lower(),
    "in": lambda value, threshold: all(item.lower() in [v.lower() for v in value] for item in threshold) if isinstance(threshold, list) and isinstance(value, list) else False,
}

