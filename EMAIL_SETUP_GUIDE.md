# 📧 Custom Email Templates Setup Guide for XFoli AI

This guide will walk you through setting up professional, branded email templates in your Supabase project to replace the generic default templates.

## 🎯 Why Custom Email Templates?

- **Professional Branding**: Consistent with your XFoli AI brand
- **Better User Experience**: Clear, informative, and engaging emails
- **Security Features**: Better security information and alternative verification methods
- **Mobile Responsive**: Optimized for all devices

## 📋 Prerequisites

- Access to your Supabase project dashboard
- Admin permissions to modify authentication settings
- The custom email template files (provided in `email-templates/` folder)

## 🚀 Step-by-Step Setup Instructions

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your XFoli AI project
4. Navigate to **Authentication** → **Email Templates** in the sidebar

### Step 2: Configure Confirmation Email Template

1. In the Email Templates section, click on **"Confirm signup"**
2. You'll see two tabs: **"Message"** and **"Template"**
3. Click on the **"Template"** tab
4. Replace the entire content with the HTML from `email-templates/confirmation.html`
5. Update the **Subject** field to: `Welcome to XFoli AI - Confirm Your Email`
6. Click **"Save"** to apply changes

### Step 3: Configure Password Recovery Email Template

1. Click on **"Reset password"** in the Email Templates section
2. Click on the **"Template"** tab
3. Replace the entire content with the HTML from `email-templates/recovery.html`
4. Update the **Subject** field to: `Reset Your XFoli AI Password`
5. Click **"Save"** to apply changes

### Step 4: Configure Additional Templates (Optional)

For a complete branded experience, you can also customize:

#### Magic Link Template
- **Subject**: `Your XFoli AI Magic Link - Secure Sign In`
- **Use Case**: Passwordless authentication

#### Invite User Template
- **Subject**: `You're Invited to Join XFoli AI`
- **Use Case**: Team invitations

#### Email Change Template
- **Subject**: `Confirm Your New Email Address - XFoli AI`
- **Use Case**: When users change their email

### Step 5: Configure Email Settings

1. Go to **Authentication** → **Settings**
2. Scroll down to **"Email"** section
3. Ensure these settings are configured:

```
Site URL: https://yourdomain.com
Redirect URLs: 
- https://yourdomain.com/auth/callback
- https://yourdomain.com/dashboard
```

### Step 6: Test Your Email Templates

#### Test Confirmation Email:
1. Go to **Authentication** → **Users**
2. Click **"Invite a user"**
3. Enter a test email address
4. Check the email to see your new branded template

#### Test Password Recovery Email:
1. Go to your application's login page
2. Click "Forgot Password"
3. Enter a test email
4. Check the email to see your new recovery template

## 🎨 Customization Options

### Update Branding Elements

You can customize these elements in the email templates:

1. **Colors**: Update the gradient colors in the CSS
2. **Logo**: Add your logo URL in the header section
3. **Contact Email**: Update `support@xfoliai.com` to your actual support email
4. **Website URL**: Update references to your actual domain
5. **Company Name**: Ensure all references say "XFoli AI" or your preferred name

### Example Customizations:

#### Change Primary Color:
```css
/* Replace purple gradient with your brand colors */
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

#### Add Logo:
```html
<!-- Add this in the header section -->
<img src="https://yourdomain.com/logo.png" alt="XFoli AI" style="height: 40px; margin-bottom: 10px;">
```

#### Update Support Email:
```html
<!-- Replace all instances of support@xfoliai.com -->
<a href="mailto:your-support@yourdomain.com">your-support@yourdomain.com</a>
```

## ⚠️ Important Security Considerations

### 1. Email Prefetching Protection

The templates include backup instructions for users who have trouble with the primary confirmation button:

- **Confirmation URL**: Direct link method (primary)
- **Backup Link**: Copy-paste URL for email clients with button issues

### 2. Link Expiration

- Confirmation links expire in **24 hours**
- Password reset links expire in **60 minutes**
- Users are clearly informed about expiration times

### 3. Clear Security Messaging

The templates include:
- Clear security notices
- Instructions for users who didn't request the action
- Information about link usage limits

## 🧪 Testing Checklist

After setup, test these scenarios:

- [ ] New user signup confirmation email
- [ ] Password recovery email
- [ ] Email displays correctly on mobile devices
- [ ] Links work properly and redirect to correct pages
- [ ] Backup copy-paste links work if buttons fail
- [ ] Emails look professional and branded

## 🔧 Troubleshooting

### Common Issues:

1. **Template not saving**: Ensure you're in the "Template" tab, not "Message"
2. **Links not working**: Verify your Site URL and Redirect URLs are correct
3. **Images not showing**: Make sure image URLs are absolute (https://)
4. **Mobile formatting issues**: The templates are responsive, but test on actual devices

### Support:

If you encounter issues:
1. Check the Supabase dashboard logs in **Logs** → **Auth**
2. Test with a simple HTML template first
3. Verify all Supabase variables are correctly formatted: `{{ .VariableName }}`

## 📚 Available Supabase Variables

You can use these variables in your templates:

| Variable | Description | Usage |
|----------|-------------|-------|
| `{{ .ConfirmationURL }}` | Full confirmation/reset URL | Primary action button |
| `{{ .Token }}` | 6-digit OTP code | Used for SMS/Magic link flows only |
| `{{ .TokenHash }}` | Hashed token for custom URLs | Advanced custom flows |
| `{{ .SiteURL }}` | Your application's base URL | Footer links |
| `{{ .Email }}` | User's email address | Personalization |
| `{{ .NewEmail }}` | New email (email change only) | Email change confirmation |

## 🎉 Final Result

After implementing these templates, your users will receive:

- **Professional, branded emails** that match your XFoli AI identity
- **Clear, actionable instructions** with prominent call-to-action buttons
- **Multiple verification options** for better security and reliability
- **Mobile-responsive design** that looks great on all devices
- **Comprehensive security information** to build user trust

Your email templates will now look professional and provide a much better user experience compared to the default Supabase templates!

---

**Need help?** If you run into any issues during setup, refer to the [Supabase Email Templates Documentation](https://supabase.com/docs/guides/auth/auth-email-templates) or reach out to support. 