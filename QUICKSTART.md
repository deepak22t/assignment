# 🚀 Quick Start Guide

Get the Real Estate Chatbot running in 5 minutes!

## Prerequisites Check
- ✅ Python 3.8+ installed
- ✅ Node.js 16+ installed
- ✅ MongoDB (optional - app works without it)

## Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

✅ Backend running at `http://localhost:8000`

## Step 2: Frontend Setup (2 minutes)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ Frontend running at `http://localhost:3000`

## Step 3: Test It Out! (1 minute)

1. Open `http://localhost:3000` in your browser
2. Try the chatbot:
   - "Show me properties under $500,000"
   - "3 bedroom house in San Francisco"
   - "Properties with pool"
3. Browse properties and click "Predict" to see ML price predictions
4. Save properties and compare them!

## 🎉 You're Done!

The app is now running. Check out:
- **Chatbot**: Natural language property search
- **All Properties**: Browse and filter properties
- **Saved**: Your favorite properties
- **Compare**: Side-by-side property comparison

## Troubleshooting

**Backend won't start?**
- Make sure you're in the `backend` directory
- Check Python version: `python --version`
- Verify `complex_price_model_v2.pkl` exists

**Frontend won't start?**
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` and run `npm install` again

**CORS errors?**
- Make sure backend is running on port 8000
- Check browser console for specific errors

**Model loading error?**
- The class definition is already in `main.py`
- Make sure you're running from the `backend` directory

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check API docs at `http://localhost:8000/docs`
- Customize the chatbot responses
- Add MongoDB for persistent storage (optional)

Happy coding! 🏠✨

