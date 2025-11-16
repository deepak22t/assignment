# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

Your project is now configured for Vercel deployment! Follow these steps:

### Step 1: Deploy via Vercel Dashboard

1. **Go to Vercel**: Visit [https://vercel.com](https://vercel.com)
2. **Sign up/Login**: Use your GitHub account
3. **Import Project**: 
   - Click "Add New Project"
   - Select your repository: `deepak22t/assignment`
   - Click "Import"

### Step 2: Configure Build Settings

Vercel should auto-detect the configuration, but verify:

**Root Directory:** Leave as root (`.`)

**Build Settings:**
- Framework Preset: **Other**
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/build`
- Install Command: `cd frontend && npm install`

**Environment Variables:**
- Add if needed: `REACT_APP_API_URL` = (will be set automatically to your Vercel URL)

### Step 3: Deploy

Click **"Deploy"** and wait 2-3 minutes.

### Step 4: Access Your App

After deployment, you'll get:
- **Frontend URL**: `https://assignment.vercel.app` (or your custom domain)
- **Backend API**: `https://assignment.vercel.app/api/*`

---

## 📝 Important Notes

### Backend API Routes
All your FastAPI routes will be available at:
- `https://your-app.vercel.app/api/properties`
- `https://your-app.vercel.app/api/chat`
- `https://your-app.vercel.app/api/predict`

### Frontend Configuration
The frontend is configured to use the same domain for API calls. The `api.ts` file will automatically use the Vercel deployment URL.

### File Structure for Vercel
```
assignment/
├── api/
│   └── index.py          # Serverless handler for FastAPI
├── backend/              # Backend code
├── frontend/             # Frontend code
└── vercel.json           # Vercel configuration
```

---

## 🔧 Troubleshooting

### Build Fails
- Check that all dependencies are in `backend/requirements.txt`
- Ensure `frontend/package.json` has all dependencies
- Check build logs in Vercel dashboard

### API Routes Not Working
- Verify `api/index.py` exists and is correct
- Check that `mangum` is in `backend/requirements.txt`
- Review Vercel function logs

### CORS Issues
- The backend already has CORS configured for all origins
- If issues persist, update `allow_origins` in `backend/main.py` to include your Vercel domain

### Environment Variables
If you need MongoDB or other services:
1. Go to Vercel project settings
2. Navigate to "Environment Variables"
3. Add: `MONGODB_URI` = your MongoDB connection string

---

## 🎯 After Deployment

### Test Your Deployment

1. **Frontend**: Visit `https://your-app.vercel.app`
2. **Backend Health**: Visit `https://your-app.vercel.app/api/`
3. **API Docs**: Visit `https://your-app.vercel.app/api/docs`

### Update Frontend API URL (if needed)

If the frontend needs to point to a different backend:
1. Go to Vercel project settings
2. Add environment variable: `REACT_APP_API_URL`
3. Value: Your backend URL
4. Redeploy

---

## 📞 Need Help?

If deployment fails:
1. Check Vercel build logs
2. Verify all files are committed to GitHub
3. Ensure `vercel.json` is in the root directory
4. Check that `api/index.py` exists

---

**Your app will be live at:** `https://your-app-name.vercel.app` 🎉

