# 🖥️ Backend Deployment Guide: Render

Deploy your FastAPI backend to Render with this step-by-step guide.

## 📋 **Pre-Deployment Checklist**

- [ ] Backend runs locally at `http://localhost:8000`
- [ ] All API endpoints working
- [ ] Environment variables configured locally
- [ ] Supabase service role key tested

## 🔧 **Step 1: Prepare Backend for Production**

### Add Production Dependencies:
First, let's check if we need to add any production dependencies to `pyproject.toml`:

```toml
# backend/pyproject.toml should include:
[project]
dependencies = [
    "fastapi",
    "uvicorn[standard]",
    "sqlmodel", 
    "supabase",
    "python-multipart",
    "python-dotenv",  # For environment variables
    # ... other dependencies
]
```

### Create Render Build Script:
Create a new file in your backend directory:

**`backend/render_build.sh`**:
```bash
#!/usr/bin/env bash
# Render build script

set -o errexit  # Exit on error

echo "🔧 Installing dependencies..."
pip install --upgrade pip
pip install -e .

echo "✅ Build complete!"
```

### Create Render Start Script:
**`backend/render_start.sh`**:
```bash
#!/usr/bin/env bash
# Render start script

echo "🚀 Starting XFoli AI Backend..."
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Make Scripts Executable:
```bash
chmod +x backend/render_build.sh
chmod +x backend/render_start.sh
```

## 🌐 **Step 2: Deploy to Render**

### Create Render Account:
1. Go to [https://render.com](https://render.com)
2. Sign up/Sign in with GitHub
3. Connect your GitHub repository

### Create Web Service:
1. Click **"New +"** → **"Web Service"**
2. Connect your repository
3. Configure the service:

```
Name: xfoli-ai-backend
Region: Oregon (US West) or closest to users
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: ./render_build.sh
Start Command: ./render_start.sh
```

### Advanced Settings:
```
Auto-Deploy: Yes
Health Check Path: /health (we'll add this endpoint)
```

## 🔐 **Step 3: Configure Environment Variables**

In Render Dashboard → Your Service → **Environment**:

### Required Variables:
```env
SUPABASE_URL=https://swnwulonwcekwzfadusy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:3000
ENV=production
```

### Important Notes:
- **CORS_ORIGINS**: Must include your Vercel frontend URL
- **No quotes** around values in Render environment variables
- **SUPABASE_SERVICE_ROLE_KEY**: Same key from your local `.env`

## ⚕️ **Step 4: Add Health Check Endpoint**

✅ Health check endpoint added to `backend/app/main.py`:

```python
@app.get("/health")
def health_check():
    """Health check endpoint for deployment monitoring"""
    return {
        "status": "healthy", 
        "message": "XFoli AI Backend is running",
        "version": "1.0.0"
    }
```

## 🔧 **Step 5: Update CORS for Production**

Update CORS origins in `backend/app/main.py` for production:

```python
# Add environment-based CORS origins
import os

cors_origins = [
    "http://localhost:3000",  # Local development
    "http://127.0.0.1:3000",  # Local development
]

# Add production origins from environment variable
if production_origins := os.getenv("CORS_ORIGINS"):
    cors_origins.extend(production_origins.split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🚀 **Step 6: Create Deployment Files**

### Create `backend/render_build.sh`:
```bash
#!/usr/bin/env bash
set -o errexit

echo "🔧 Installing dependencies..."
pip install --upgrade pip
pip install -e .
echo "✅ Build complete!"
```

### Create `backend/render_start.sh`:
```bash
#!/usr/bin/env bash
echo "🚀 Starting XFoli AI Backend..."
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Make executable:
```bash
chmod +x backend/render_build.sh
chmod +x backend/render_start.sh
```

## 📦 **Step 7: Deploy to Render**

### Render Configuration:
```
Service Type: Web Service
Repository: Your GitHub repo
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: ./render_build.sh
Start Command: ./render_start.sh
Health Check Path: /health
Auto-Deploy: Yes
```

### Environment Variables in Render:
```env
SUPABASE_URL=https://swnwulonwcekwzfadusy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CORS_ORIGINS=https://your-app.vercel.app
ENV=production
```

## ✅ **Step 8: Test Backend Deployment**

### After deployment, test these endpoints:

**Health Check:**
```
GET https://your-backend.onrender.com/health
Response: {"status": "healthy", "message": "XFoli AI Backend is running"}
```

**API Documentation:**
```
GET https://your-backend.onrender.com/docs
```

**Test API Endpoints:**
```
GET https://your-backend.onrender.com/api/portfolios
GET https://your-backend.onrender.com/api/search/stocks?query=AAPL
```

## 🔄 **Step 9: Update Frontend Environment**

Once backend is deployed, update your Vercel environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com
```

## 🎯 **Step 10: Final Integration Test**

Test the complete flow:
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render
- [ ] Environment variables configured
- [ ] CORS allows frontend domain
- [ ] Supabase redirect URLs updated
- [ ] Sign up → Email confirmation → Login → Portfolio management

## 🔧 **Common Issues & Fixes**

### Build Failures:
```bash
# Test build locally first
cd backend
pip install -e .
```

### CORS Errors:
- Ensure `CORS_ORIGINS` includes your Vercel URL
- No trailing slash in URLs
- Check browser network tab for exact error

### Health Check Failures:
- Verify `/health` endpoint works locally
- Check Render logs for startup errors
- Ensure port binding is correct (`$PORT`)

### Environment Variable Issues:
- No quotes around values in Render
- Check variable names are exact (case-sensitive)
- Redeploy after adding variables

## 📱 **Expected URLs**

After successful deployment:

- **Backend API**: `https://your-backend.onrender.com`
- **API Docs**: `https://your-backend.onrender.com/docs`
- **Health Check**: `https://your-backend.onrender.com/health`

## 🔄 **Auto-Deployment**

Render automatically redeploys when you push to your main branch:

```bash
# Make backend changes
git add backend/
git commit -m "Update backend feature" 
git push origin main
# Render automatically builds and deploys!
```

---

Your backend is now production-ready! 🎉 