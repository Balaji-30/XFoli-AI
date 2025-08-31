# 🚨 **IMMEDIATE FIX**: Backend Environment Setup

The error `Supabase admin credentials not configured` means you need to create a `.env` file in your `backend/` directory.

## 🔧 **Step 1: Create `.env` File**

Create a new file called `.env` in your `backend/` directory:

```bash
# Navigate to backend directory
cd backend

# Create .env file
touch .env
```

## 📝 **Step 2: Add Supabase Configuration**

Open `backend/.env` and add these lines:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 🔑 **Step 3: Get Your Actual Values**

### Get Supabase URL:
1. Go to [https://supabase.com](https://supabase.com)
2. Select your project
3. The URL is visible in your browser or dashboard

### Get Service Role Key:
1. In Supabase Dashboard → **Settings** → **API**  
2. Look for **Project API keys** section
3. Copy the **service_role** key (NOT the anon key)
4. ⚠️ **This key has admin privileges - keep it secret!**

## 📋 **Step 4: Example .env File**

Your `backend/.env` should look like this (with your real values):

```env
SUPABASE_URL=https://swnwulonwcekwzfadusy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-service-role-key...
```

## 🔄 **Step 5: Restart Backend**

After creating the `.env` file:

```bash
# Stop your current backend server (Ctrl+C)
# Then restart it
cd backend
python run_dev.py
```

## ✅ **Test Account Deletion**

1. Try deleting an account again
2. You should see: `✅ Supabase user {user_id} deleted successfully`
3. No more warning about "admin credentials not configured"

## 🚨 **Security Notes**

- **Never commit `.env` to git** (it should be in `.gitignore`)
- **Service role key has full admin access** - keep it secret
- **Only use in backend** - never expose in frontend code

---

Once you create the `.env` file with your Supabase credentials, the account deletion will work completely and users can reuse email addresses immediately! 🎉 