# Backend Structure Documentation

## Project Organization

The backend is now organized in a structured, modular way following best practices:

```
backend/
├── main.py                 # FastAPI app initialization
├── models/                 # Pydantic models
│   ├── __init__.py
│   └── schemas.py          # All request/response schemas
├── services/               # Business logic
│   ├── __init__.py
│   ├── property_service.py # Property data operations
│   ├── ml_service.py       # ML model operations
│   └── chatbot_service.py  # Chatbot logic
├── routes/                 # API route handlers
│   ├── __init__.py
│   ├── properties.py       # Property endpoints
│   ├── chatbot.py          # Chatbot endpoints
│   └── predictions.py      # Prediction endpoints
├── mongodb_service.py      # MongoDB integration
├── requirements.txt        # Dependencies
└── data/                   # JSON data files
```

## Architecture

### Models (`models/schemas.py`)
All Pydantic models for request/response validation:
- **Request Models**: `ChatMessageRequest`, `PropertyFilterRequest`, `SavePropertyRequest`, `ComparePropertiesRequest`, `PredictionRequest`
- **Response Models**: `PropertyResponse`, `PropertiesListResponse`, `ChatResponse`, `PredictionResponse`, `ComparisonResponse`, etc.

### Services (`services/`)
Business logic separated by domain:

1. **property_service.py**: 
   - Data loading and merging
   - Property filtering
   - Property retrieval by ID

2. **ml_service.py**:
   - ML model loading and management
   - Price prediction operations
   - Model availability checks

3. **chatbot_service.py**:
   - Message processing
   - Preference extraction from natural language
   - Response generation

### Routes (`routes/`)
API endpoints organized by feature:

1. **properties.py**: `/api/properties/*`
   - GET `/api/properties` - Get all properties
   - POST `/api/properties/search` - Search/filter properties
   - POST `/api/properties/save` - Save property
   - GET `/api/properties/saved/{user_id}` - Get saved properties
   - POST `/api/properties/compare` - Compare two properties

2. **chatbot.py**: `/api/chat/*`
   - POST `/api/chat` - Chat with bot

3. **predictions.py**: `/api/*`
   - POST `/api/predict` - Direct ML prediction
   - POST `/api/properties/{id}/predict` - Predict for property

## Key Features

### ✅ Pydantic Models
- All requests use Pydantic models for validation
- All responses use Pydantic models for type safety
- Field validation (min/max values, patterns, etc.)

### ✅ Separation of Concerns
- Routes handle HTTP logic only
- Services contain business logic
- Models define data structures

### ✅ Functional Design
- Pure functions where possible
- Service classes for stateful operations (ML model)
- Clear dependencies and imports

### ✅ Error Handling
- HTTPException for API errors
- Proper status codes
- Descriptive error messages

## Usage Example

```python
# Request with validation
request = PropertyFilterRequest(
    location="San Francisco",
    max_price=500000,
    bedrooms=3
)

# Service handles business logic
filtered = property_service.filter_properties(properties, request)

# Response model ensures type safety
response = PropertiesListResponse(
    properties=[convert_to_property_response(p) for p in filtered],
    count=len(filtered)
)
```

## Benefits

1. **Maintainability**: Clear separation makes code easy to understand and modify
2. **Testability**: Services can be tested independently
3. **Type Safety**: Pydantic ensures data validation
4. **Scalability**: Easy to add new features without affecting existing code
5. **Documentation**: FastAPI auto-generates API docs from models






[
  {
    "id": 1,
    "image_url": "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
  },
  {
    "id": 2,
    "image_url": "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg"
  },
  {
    "id": 3,
    "image_url": "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"
  },
  {
    "id": 4,
    "image_url": "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"
  },
  {
    "id": 5,
    "image_url": "https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg"
  },
  {
    "id": 6,
    "image_url": "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
  },
  {
    "id": 7,
    "image_url": "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg"
  },
  {
    "id": 8,
    "image_url": "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"
  },
  {
    "id": 9,
    "image_url": "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"
  },
  {
    "id": 10,
    "image_url": "https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg"
  }
]
