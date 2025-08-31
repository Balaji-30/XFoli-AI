# 📁 Repository Setup Guide

Complete guide for setting up your XFoli AI monorepo for deployment.

## 🏗️ **Monorepo Structure**

Your repository structure is perfect for deployment:

```
Xport/ (root repository)
├── .gitignore                    ← ✅ Created
├── README.md                     ← Project overview  
├── DEPLOYMENT_CHECKLIST.md      ← ✅ Created
├── FRONTEND_VERCEL_DEPLOYMENT.md ← ✅ Created
├── BACKEND_RENDER_DEPLOYMENT.md  ← ✅ Created
├── frontend/                     ← Vercel deploys from here
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   ├── next.config.ts
│   └── ...
├── backend/                      ← Render deploys from here
│   ├── app/
│   ├── pyproject.toml
│   ├── render_build.sh           ← ✅ Created
│   ├── render_start.sh           ← ✅ Created
│   └── ...
└── docs/ (optional)
    └── additional-guides.md
```

## 🚫 **Git Setup Steps**

### ✅ Step 1: Verify Git Status
```bash
git status
```

### ✅ Step 2: Add All Files
```bash
# Add all files (except those in .gitignore)
git add .

# Check what will be committed
git status
```

### ✅ Step 3: Create Initial Commit
```bash
git commit -m "Initial commit: XFoli AI monorepo with frontend and backend"
```

### ✅ Step 4: Create GitHub Repository
1. Go to [https://github.com](https://github.com)
2. Click **"New repository"**
3. Configure:
   ```
   Repository name: xfoli-ai
   Description: XFoli AI - Portfolio management with AI insights
   Visibility: Private (recommended) or Public
   
   ❌ Don't initialize with README (you already have files)
   ❌ Don't add .gitignore (you already created one)
   ❌ Don't add license (you can add later)
   ```

### ✅ Step 5: Connect Local to GitHub
```bash
# Add GitHub remote (replace with your actual repository URL)
git remote add origin https://github.com/yourusername/xfoli-ai.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🔒 **Security Checklist**

### ✅ Environment Variables Protected:
- [ ] ✅ `.env` files in `.gitignore`
- [ ] ✅ No API keys in code
- [ ] ✅ Supabase keys not committed
- [ ] ✅ Backend service role key protected

### ✅ Files to NEVER Commit:
```
❌ backend/.env (Supabase service role key)
❌ frontend/.env.local (Frontend environment vars)
❌ node_modules/ (Dependencies)
❌ .venv/ (Python virtual environment)
❌ *.key, *.pem (Certificate files)
```

### ✅ Files That SHOULD Be Committed:
```
✅ Source code (frontend/app/, backend/app/)
✅ Configuration files (package.json, pyproject.toml)
✅ Deployment scripts (render_build.sh, render_start.sh)
✅ Documentation (*.md files)
✅ Lock files (package-lock.json, uv.lock)
```

## 🚀 **Deployment Benefits of Monorepo**

### **Vercel Deployment:**
- Set **Root Directory**: `frontend`
- Auto-detects Next.js framework
- Deploys only frontend code

### **Render Deployment:**
- Set **Root Directory**: `backend`
- Uses your deployment scripts
- Deploys only backend code

### **Shared Benefits:**
- ✅ **Single repository** to manage
- ✅ **Atomic updates** (frontend + backend together)
- ✅ **Easier collaboration** 
- ✅ **Consistent versioning**
- ✅ **Simplified CI/CD**

## 📋 **Pre-Deployment Verification**

Before pushing to GitHub, verify your structure:

### ✅ Frontend Check:
```bash
cd frontend
npm run build  # Should build successfully
```

### ✅ Backend Check:
```bash
cd backend
python -m app.main  # Should start without errors
```

### ✅ Repository Check:
```bash
# From project root
git status  # Should show clean working directory
git log --oneline  # Should show your commits
```

## 🔄 **Deployment Workflow**

After repository setup, your deployment workflow will be:

```
1. Make changes locally
2. Test frontend: npm run dev
3. Test backend: python run_dev.py
4. Commit changes: git commit -m "Feature description"
5. Push to GitHub: git push origin main
6. 🚀 Auto-deployment:
   - Vercel deploys frontend automatically
   - Render deploys backend automatically
```

## 🛠️ **Common Git Commands**

### Daily Development:
```bash
# Check status
git status

# Add specific files
git add frontend/app/page.tsx
git add backend/app/api/portfolios.py

# Add all changes
git add .

# Commit with message
git commit -m "Add account deletion feature"

# Push to GitHub
git push origin main
```

### Working with Branches:
```bash
# Create feature branch
git checkout -b feature/new-feature

# Switch between branches
git checkout main
git checkout feature/new-feature

# Merge feature into main
git checkout main
git merge feature/new-feature
```

### Rollback if Needed:
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a specific commit
git revert <commit-hash>
```

## 📱 **Repository Best Practices**

### ✅ Commit Messages:
```
✅ Good: "Add user account deletion with Supabase cleanup"
✅ Good: "Fix email confirmation redirect flow"
✅ Good: "Update CORS configuration for production"

❌ Bad: "fix bug"
❌ Bad: "updates"
❌ Bad: "wip"
```

### ✅ Branch Strategy:
```
main         ← Production-ready code
├── develop  ← Integration branch (optional)
├── feature/account-deletion
├── feature/email-templates
└── hotfix/cors-fix
```

### ✅ Deployment Strategy:
- **main branch** → Auto-deploys to production
- **develop branch** → Auto-deploys to staging (optional)
- **feature branches** → Deploy previews (Vercel provides this)

---

## 🎯 **Next Steps**

After completing repository setup:

1. ✅ **Verify .gitignore** is working
2. ✅ **Push to GitHub** 
3. ✅ **Deploy Backend** to Render
4. ✅ **Deploy Frontend** to Vercel
5. ✅ **Configure Environment Variables**
6. ✅ **Update Supabase URLs**
7. ✅ **Test Production Deployment**

Your monorepo is now ready for seamless deployment! 🚀 