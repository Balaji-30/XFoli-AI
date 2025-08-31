# 🔧 Supabase User Deletion Setup

To enable complete account deletion (including Supabase user accounts), you need to configure the service role key in your backend.

## 🔑 Getting Your Supabase Service Role Key

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in and select your project
3. Navigate to **Settings** → **API**

### Step 2: Find Service Role Key
1. In the API settings, look for **Project API keys**
2. Copy the **service_role** key (NOT the anon key)
3. ⚠️ **Warning**: Keep this key secret - it has admin privileges!

### Step 3: Add to Backend Environment
Add these environment variables to your backend `.env` file:

```env
# Backend .env file
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 🔧 How Account Deletion Now Works

### Before (Incomplete):
1. ✅ Delete application data (portfolios, holdings)
2. ❌ User remains in Supabase auth table
3. ❌ Next signup with same email fails (no confirmation email)

### After (Complete):
1. ✅ Delete application data (portfolios, holdings)  
2. ✅ Delete Supabase user account completely
3. ✅ Email address is freed up for new signups
4. ✅ No orphaned user records

## 🛡️ Security Notes

- **Service Role Key**: Has full admin access to your Supabase project
- **Backend Only**: Never expose this key in frontend code
- **Environment Variables**: Store securely, never commit to version control
- **Error Handling**: Account deletion continues even if Supabase deletion fails

## ✅ Testing User Deletion

1. **Create test account** with email `test@example.com`
2. **Delete account** via Settings → Delete Account
3. **Try to signup again** with same email
4. **Should receive confirmation email** (not blocked)

## 🚨 Without Service Role Key

If you don't set up the service role key:
- ✅ Application data still gets deleted
- ❌ Supabase user remains (causing email signup issues)
- ⚠️ Warning logged but operation doesn't fail

## 📝 Environment Setup Checklist

- [ ] Added `SUPABASE_URL` to backend `.env`
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY` to backend `.env`  
- [ ] Restarted backend server
- [ ] Tested account deletion with fresh email
- [ ] Verified email can be used for new signup after deletion

---

This setup ensures complete account deletion and prevents the "no confirmation email" issue when users try to reuse email addresses! 