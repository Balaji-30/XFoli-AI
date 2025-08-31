# 🚀 Frontend Deployment Guide: Vercel

Deploy your Next.js frontend to Vercel with this step-by-step guide.

## 📋 **Pre-Deployment Checklist**

- [ ] Frontend works locally at `http://localhost:3000`
- [ ] Backend API endpoints are working
- [ ] Supabase authentication is configured
- [ ] All environment variables identified

## 🔧 **Step 1: Prepare Your Repository**

### Push to GitHub (if not already done):
```bash
# From your project root
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Frontend Structure Check:
```
frontend/
├── app/
├── components/
├── lib/
├── package.json
├── next.config.ts
└── tsconfig.json
```

## 🌐 **Step 2: Deploy to Vercel**

### Option A: Deploy via Vercel Dashboard
1. Go to [https://vercel.com](https://vercel.com)
2. Sign up/Sign in with GitHub
3. Click **"New Project"**
4. Import your repository
5. **Root Directory**: Set to `frontend`
6. **Framework Preset**: Next.js (auto-detected)
7. Click **Deploy**

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# From your frontend directory
cd frontend
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: xfoli-ai (or your choice)
# - Directory: ./ (current directory)
```

## 🔐 **Step 3: Configure Environment Variables**

In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**:

### Required Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://swnwulonwcekwzfadusy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.onrender.com
```

### How to Get These:

**Supabase Keys:**
1. Supabase Dashboard → Settings → API
2. Copy **URL** and **anon/public** key (NOT service_role)

**Backend URL:**
- You'll get this after deploying to Render (Step 4)
- Format: `https://your-app-name.onrender.com`

## 🔄 **Step 4: Update Supabase Redirect URLs**

In Supabase Dashboard → Authentication → URL Configuration:

### Add Production URLs:
```
Site URL: https://your-app.vercel.app

Redirect URLs:
https://your-app.vercel.app/auth/callback
https://your-app.vercel.app/auth/confirm
https://your-app.vercel.app/signin
https://localhost:3000/auth/callback (keep for local dev)
https://localhost:3000/auth/confirm (keep for local dev)
https://localhost:3000/signin (keep for local dev)
```

## 🎯 **Step 5: Custom Domain (Optional)**

### Add Custom Domain:
1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add your domain (e.g., `app.yourdomain.com`)
3. Configure DNS records as shown
4. Update Supabase URLs to use your custom domain

## ✅ **Step 6: Test Deployment**

### Test These Features:
- [ ] Sign up with new email
- [ ] Email confirmation works
- [ ] Sign in/Sign out
- [ ] Create/view/delete portfolios
- [ ] Settings page and account deletion
- [ ] All API calls work with production backend

## 🔧 **Common Issues & Fixes**

### Build Errors:
```bash
# Check for TypeScript errors locally
cd frontend
npm run build

# Fix any errors before deploying
```

### Environment Variables Not Working:
- Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding environment variables
- Check Vercel logs for specific errors

### CORS Issues:
- Ensure backend CORS allows your Vercel domain
- Update backend `CORS_ORIGINS` environment variable

### Supabase Issues:
- Double-check redirect URLs include your Vercel domain
- Verify anon key is correct (not service_role key)

## 📱 **Expected URLs**

After successful deployment:

- **Frontend**: `https://your-app.vercel.app`
- **Admin Dashboard**: `https://your-app.vercel.app/dashboard`
- **Settings**: `https://your-app.vercel.app/dashboard/settings`

## 🔄 **Auto-Deployment**

Vercel automatically redeploys when you push to your main branch:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically builds and deploys!
```

---

Next: Deploy your backend to Render! 🚀 