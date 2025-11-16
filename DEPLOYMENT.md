# 🚀 Deployment Guide

## Current Status
✅ Code is pushed to GitHub: https://github.com/deepak22t/assignment

## ⚠️ Important Note
**GitHub only stores your code - it does NOT run your application!**

To make your service accessible via a URL, you need to deploy it to a hosting platform.

---

## 🎯 Deployment Options

### Option 1: Railway (Recommended - Easy & Free)
**Best for:** Quick deployment, free tier available

#### Backend Deployment (FastAPI)
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `assignment` repository
5. Select the `backend` folder as root directory
6. Railway will auto-detect Python and deploy
7. Your backend URL will be: `https://your-app-name.railway.app`

#### Frontend Deployment (React)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
3. Connect your GitHub repo
4. Set build command: `npm run build`
5. Set output directory: `build`
6. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.railway.app`

---

### Option 2: Render (Free Tier Available)
**Best for:** Simple deployment, free tier

#### Backend Deployment
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Settings:
   - **Name:** assignment-backend
   - **Root Directory:** backend
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Your backend URL: `https://assignment-backend.onrender.com`

#### Frontend Deployment
1. On Render, click "New" → "Static Site"
2. Connect GitHub repo
3. Settings:
   - **Root Directory:** frontend
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** build
4. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.onrender.com`

---

### Option 3: Vercel (Frontend) + Railway/Render (Backend)
**Best for:** Best performance for frontend

#### Frontend on Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Root directory: `frontend`
4. Framework preset: React
5. Build command: `npm run build`
6. Output directory: `build`
7. Add environment variable: `REACT_APP_API_URL=https://your-backend-url`

---

## 📝 Step-by-Step: Deploy to Railway (Easiest)

### Step 1: Deploy Backend
```bash
1. Visit https://railway.app
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select: deepak22t/assignment
5. In settings, set Root Directory to: backend
6. Add environment variable (if needed): MONGODB_URI=your_mongodb_uri
7. Wait for deployment (2-3 minutes)
8. Copy your backend URL (e.g., https://assignment-production.up.railway.app)
```

### Step 2: Deploy Frontend
```bash
1. Visit https://vercel.com
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import: deepak22t/assignment
5. Configure:
   - Root Directory: frontend
   - Framework Preset: Create React App
   - Build Command: npm run build
   - Output Directory: build
6. Add Environment Variable:
   - Key: REACT_APP_API_URL
   - Value: [Your Railway backend URL from Step 1]
7. Deploy
8. Your frontend will be live at: https://your-app.vercel.app
```

---

## 🔗 After Deployment

### Backend URL
- API Base: `https://your-backend.railway.app` or `https://your-backend.onrender.com`
- API Docs: `https://your-backend.railway.app/docs`
- Health Check: `https://your-backend.railway.app/`

### Frontend URL
- App: `https://your-app.vercel.app` or `https://your-app.netlify.app`

---

## ⚙️ Environment Variables

### Backend (.env or platform settings)
```
MONGODB_URI=mongodb://localhost:27017/  # Optional
PORT=8000  # Usually set by platform
```

### Frontend (platform settings)
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

---

## 🧪 Testing Deployment

1. **Test Backend:**
   ```bash
   curl https://your-backend-url.railway.app/
   # Should return: {"message":"Real Estate Chatbot API","status":"running"}
   ```

2. **Test Frontend:**
   - Visit your frontend URL
   - Open browser console
   - Check if API calls are working

---

## 🐛 Troubleshooting

### Backend Issues
- **Port Error:** Make sure you're using `$PORT` environment variable
- **Module Not Found:** Check `requirements.txt` includes all dependencies
- **CORS Error:** Update `allow_origins` in `main.py` to include your frontend URL

### Frontend Issues
- **API Connection Failed:** Check `REACT_APP_API_URL` environment variable
- **Build Fails:** Check Node.js version (should be 16+)
- **Blank Page:** Check browser console for errors

---

## 📞 Need Help?

If you want me to help you deploy:
1. Tell me which platform you prefer (Railway, Render, Vercel)
2. I can guide you through the process step-by-step
3. Or I can create additional configuration files if needed

---

**Remember:** After deployment, your service will have a public URL that anyone can access!

