# 🚀 Complete Deployment Checklist

Deploy your XFoli AI application to production with this step-by-step checklist.

## 📋 **Pre-Deployment Preparation**

### ✅ Local Testing:
- [ ] Frontend runs locally (`npm run dev` in `frontend/`)
- [ ] Backend runs locally (`python run_dev.py` in `backend/`)
- [ ] All API endpoints working
- [ ] Authentication flow complete
- [ ] Portfolio CRUD operations working
- [ ] Account deletion working with Supabase user removal

### ✅ Repository Setup:
- [ ] All code committed to Git
- [ ] Repository pushed to GitHub
- [ ] `.env` files in `.gitignore`
- [ ] Deployment scripts created and executable

## 🖥️ **Backend Deployment (Render)**

### ✅ Step 1: Create Render Service
1. Go to [https://render.com](https://render.com)
2. Connect GitHub repository
3. Create new **Web Service**
4. Configure:
   ```
   Name: xfoli-ai-backend
   Root Directory: backend
   Runtime: Python 3
   Build Command: ./render_build.sh
   Start Command: ./render_start.sh
   Health Check Path: /health
   ```

### ✅ Step 2: Environment Variables
Add in Render Dashboard → Environment:
```env
SUPABASE_URL=https://swnwulonwcekwzfadusy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CORS_ORIGINS=https://your-app.vercel.app
ENV=production
```

### ✅ Step 3: Test Backend
- [ ] Health check: `https://your-backend.onrender.com/health`
- [ ] API docs: `https://your-backend.onrender.com/docs`
- [ ] Test endpoint: `https://your-backend.onrender.com/api/portfolios`

## 🌐 **Frontend Deployment (Vercel)**

### ✅ Step 1: Deploy to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Import GitHub repository
3. Configure:
   ```
   Root Directory: frontend
   Framework: Next.js
   Build Command: npm run build
   Output Directory: .next
   ```

### ✅ Step 2: Environment Variables
Add in Vercel Dashboard → Settings → Environment Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://swnwulonwcekwzfadusy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com
```

### ✅ Step 3: Update Backend CORS
Update Render environment variable:
```env
CORS_ORIGINS=https://your-app.vercel.app
```

## 🔐 **Supabase Configuration**

### ✅ Update Authentication URLs
In Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://your-app.vercel.app
```

**Redirect URLs:**
```
https://your-app.vercel.app/auth/callback
https://your-app.vercel.app/auth/confirm
https://your-app.vercel.app/signin
https://localhost:3000/auth/callback
https://localhost:3000/auth/confirm
https://localhost:3000/signin
```

### ✅ Custom Email Templates
Upload the custom templates from:
- `email-templates/confirmation.html`
- `email-templates/recovery.html`

Update template URLs to use your production domain:
```
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&redirect_to={{ .SiteURL }}/signin?confirmed=true
```

## 🧪 **Production Testing**

### ✅ Authentication Flow:
- [ ] Sign up with new email
- [ ] Receive branded confirmation email
- [ ] Click email confirmation link
- [ ] Redirect to login with success message
- [ ] Sign in successfully
- [ ] Access dashboard

### ✅ Core Features:
- [ ] Create new portfolio
- [ ] Add/edit/delete holdings
- [ ] Portfolio view and navigation
- [ ] Search functionality
- [ ] Agent/AI features

### ✅ Account Management:
- [ ] Access settings page
- [ ] View account data summary
- [ ] Delete account (test with throwaway email)
- [ ] Verify user deleted from Supabase
- [ ] Test signup with same email immediately

### ✅ Security & Performance:
- [ ] HTTPS enabled on both domains
- [ ] CORS working correctly
- [ ] No console errors in browser
- [ ] API responses under 2 seconds
- [ ] Email deliverability (check spam folder)

## 🔧 **Common Deployment Issues**

### Backend Issues:
| Issue | Solution |
|-------|----------|
| Build fails | Test `pip install -e .` locally |
| Health check fails | Verify `/health` endpoint locally |
| CORS errors | Update `CORS_ORIGINS` in Render |
| Supabase errors | Check service role key is correct |

### Frontend Issues:
| Issue | Solution |
|-------|----------|
| Build fails | Run `npm run build` locally |
| Environment vars not working | Ensure `NEXT_PUBLIC_` prefix |
| API calls fail | Check `NEXT_PUBLIC_API_BASE_URL` |
| Auth redirect fails | Update Supabase redirect URLs |

### Email Issues:
| Issue | Solution |
|-------|----------|
| No confirmation emails | Check Supabase SMTP settings |
| Emails go to spam | Review email template language |
| Wrong redirect URLs | Update custom templates |
| Token errors | Verify `/auth/confirm` route works |

## 📱 **Final Production URLs**

After successful deployment:

### Frontend (Vercel):
- **App**: `https://your-app.vercel.app`
- **Dashboard**: `https://your-app.vercel.app/dashboard`
- **Settings**: `https://your-app.vercel.app/dashboard/settings`

### Backend (Render):
- **API**: `https://your-backend.onrender.com`
- **Health**: `https://your-backend.onrender.com/health`
- **Docs**: `https://your-backend.onrender.com/docs`

### Database (Supabase):
- **Dashboard**: `https://supabase.com/dashboard/project/your-project-id`
- **Database**: Managed by Supabase

## 🔄 **Ongoing Maintenance**

### Auto-Deployment:
- ✅ Vercel: Deploys automatically on `git push`
- ✅ Render: Deploys automatically on `git push`
- ✅ Environment: Keep local `.env` files for development

### Monitoring:
- [ ] Set up Render health check alerts
- [ ] Monitor Vercel function logs
- [ ] Track Supabase usage and limits
- [ ] Monitor email deliverability

---

🎉 **Congratulations!** Your XFoli AI application is now live in production!

**Key Benefits of This Deployment:**
- ✅ **Scalable**: Vercel & Render auto-scale
- ✅ **Secure**: Environment variables protected
- ✅ **Fast**: Global CDN via Vercel
- ✅ **Reliable**: Health checks and monitoring
- ✅ **Complete**: Full user lifecycle including deletion 