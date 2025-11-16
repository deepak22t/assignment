# 🏠 Real Estate Chatbot - Full Stack Application

A full-stack real estate chatbot application that helps users find properties based on their preferences, with ML-powered price prediction and property comparison features.

## 🎯 Features

### Core Features ✅
- **Interactive Chatbot** - Natural language interface for property search
- **Property Search & Filtering** - Filter by location, budget, bedrooms, bathrooms, amenities
- **Data Merging** - Combines data from multiple JSON sources (basics, characteristics, images)
- **ML Price Prediction** - Uses provided ML model to predict property prices
- **Property Comparison** - Side-by-side comparison of up to 2 properties
- **Saved Properties** - Save favorite properties (MongoDB or in-memory storage)

### Bonus Features ✨
- Real-time property search
- Property comparison with ML predictions
- Modern, responsive UI with Tailwind CSS
- RESTful API with FastAPI

## 🛠️ Tech Stack

### Backend
- **Python 3.8+**
- **FastAPI** - Modern, fast web framework
- **Pickle** - ML model loading
- **MongoDB** (optional) - For persistent saved properties storage
- **Pydantic** - Data validation

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## 📁 Project Structure

```
assignment/
├── backend/
│   ├── main.py                    # FastAPI backend server
│   ├── mongodb_service.py         # MongoDB integration (optional)
│   ├── complex_price_model_v2.pkl # ML model file
│   ├── requirements.txt          # Python dependencies
│   └── data/
│       ├── property_basics.json
│       ├── property_characteristics.json
│       └── property_images.json
├── frontend/
│   ├── src/
│   │   ├── App.js                # Main app component
│   │   ├── components/
│   │   │   ├── Chatbot.js        # Chatbot interface
│   │   │   ├── PropertyList.js  # Property listing
│   │   │   ├── PropertyComparison.js # Comparison view
│   │   │   └── SavedProperties.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
├── model_interface.md            # ML model schema documentation
└── README.md                     # This file
```

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 16+ and npm
- MongoDB (optional, for persistent storage)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up MongoDB (optional)**
   - Install MongoDB or use MongoDB Atlas (cloud)
   - Set environment variable:
     ```bash
     export MONGODB_URI="mongodb://localhost:27017/"  # or your Atlas URI
     ```
   - If not set, the app will use in-memory storage

5. **Run the backend server**
   ```bash
   python main.py
   # Or with uvicorn directly:
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`
   - API docs: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL (optional)**
   Create a `.env` file:
   ```bash
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## 📡 API Endpoints

### Property Endpoints
- `GET /api/properties` - Get all properties (merged data)
- `POST /api/properties/search` - Search/filter properties
- `POST /api/properties/save` - Save a property
- `GET /api/properties/saved/{user_id}` - Get saved properties
- `POST /api/properties/compare` - Compare two properties
- `POST /api/properties/{id}/predict` - Predict price for a property

### Chatbot Endpoint
- `POST /api/chat` - Chat with the bot (returns property recommendations)

### ML Model Endpoint
- `POST /api/predict` - Direct ML model prediction

## 💬 Using the Chatbot

The chatbot understands natural language queries like:
- "Show me properties under $500,000"
- "I'm looking for a 3 bedroom house in San Francisco"
- "Properties with pool and garage"
- "2 bedroom condo in Oakland"

## 🔧 ML Model Integration

The ML model (`complex_price_model_v2.pkl`) expects this schema:

```python
{
  "property_type": "SFH" or "Condo",
  "lot_area": int,          # For SFH only
  "building_area": int,     # For Condo only
  "bedrooms": int,
  "bathrooms": int,
  "year_built": int,
  "has_pool": bool,
  "has_garage": bool,
  "school_rating": int      # 1-10 scale
}
```

## 🐛 Troubleshooting

### Model Loading Error
If you see `AttributeError: Can't get attribute 'ComplexTrapModelRenamed'`:
- The class definition is already included in `main.py`
- Make sure you're running from the `backend` directory

### CORS Errors
- The backend includes CORS middleware allowing all origins
- In production, update `allow_origins` in `main.py`

### MongoDB Connection
- MongoDB is optional - the app works without it using in-memory storage
- Check your `MONGODB_URI` environment variable

## 📝 Development Notes

### Data Structure
- Properties are merged from 3 JSON files using `id` as the key
- Each property has: basics (title, price, location), characteristics (bedrooms, bathrooms, size, amenities), and images

### Chatbot Logic
- Currently uses keyword-based matching
- Can be enhanced with NLP APIs (OpenAI, etc.) for better understanding

### Price Prediction
- The ML model predicts prices based on property features
- Predictions are shown alongside listed prices for comparison

## 🚢 Deployment

### Backend Deployment
- **Heroku**: Add `Procfile` with `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Railway/Render**: Similar setup
- **AWS/GCP**: Use containerized deployment

### Frontend Deployment
- **Vercel**: Connect GitHub repo, auto-deploys
- **Netlify**: Drag & drop `build` folder
- **GitHub Pages**: Use `npm run build` and deploy `build` folder

### Environment Variables
- `MONGODB_URI` - MongoDB connection string (optional)
- `REACT_APP_API_URL` - Backend API URL for frontend

## ✅ Evaluation Criteria Met

- ✅ Clear UI and working chatbot flow
- ✅ Correct use of ML model and data structure
- ✅ Data merging from multiple JSON sources
- ✅ Property filtering and search
- ✅ MongoDB integration (optional)
- ✅ Property comparison feature
- ✅ Deployment-ready code structure

## 📚 Future Enhancements

- [ ] Integrate OpenAI API for better NLP
- [ ] Add user authentication
- [ ] Real-time property updates
- [ ] Advanced filtering options
- [ ] Property recommendations based on saved properties
- [ ] Email notifications for saved properties

## 👨‍💻 Author

Built as a case study for Agent Mira Hackathon

## 📄 License

This project is for educational/case study purposes.
