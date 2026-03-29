# Google OAuth Setup Guide

## Step 1: Create Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Create new project or select existing
3. Project name: `LiveCenter`

## Step 2: Configure OAuth Consent Screen

1. Go to: **APIs & Services** → **OAuth consent screen**
2. User Type: **External**
3. App name: `LiveCenter`
4. Support email: Your email
5. App logo: (optional - add later)
6. Scopes: 
   - `email`
   - `openid`
   - `profile`
7. Test users: Add your email
8. Save and continue

## Step 3: Create OAuth 2.0 Credentials

1. Go to: **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `LiveCenter Cognito`

**Authorized JavaScript origins:**
```
https://livecenter-production-XXXXX.auth.eu-central-1.amazoncognito.com
https://main.dl5iyvnws81xx.amplifyapp.com
http://localhost:3000
```

**Authorized redirect URIs:**
```
https://livecenter-production-XXXXX.auth.eu-central-1.amazoncognito.com/oauth2/idpresponse
https://main.dl5iyvnws81xx.amplifyapp.com
http://localhost:3000
```

5. Click **Create**
6. **Copy Client ID and Client Secret**

## Step 4: Update Terraform Configuration

Edit `infrastructure/terraform/terraform.tfvars`:

```hcl
google_client_id     = "YOUR_CLIENT_ID.apps.googleusercontent.com"
google_client_secret = "YOUR_CLIENT_SECRET"
```

## Step 5: Apply Terraform

```bash
cd infrastructure/terraform
terraform apply
```

## Step 6: Update Google OAuth (After Terraform)

After Terraform creates the Cognito domain, update Google OAuth:

1. Go back to Google Cloud Console
2. Edit your OAuth client
3. Replace `XXXXX` with actual domain from Terraform output:
   ```bash
   terraform output cognito_domain
   ```
4. Update authorized URIs with actual domain
5. Save

## Step 7: Test Google Login

Visit the Google login URL:

```bash
terraform output cognito_google_login_url
```

Or manually:
```
https://livecenter-production-XXXXX.auth.eu-central-1.amazoncognito.com/oauth2/authorize?identity_provider=Google&response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=https://main.dl5iyvnws81xx.amplifyapp.com
```

## What Happens

1. User clicks "Sign in with Google"
2. Redirected to Google login
3. User authenticates with Google
4. Google redirects back to Cognito with auth code
5. Cognito creates/updates user in User Pool
6. User redirected to your app with JWT tokens

## User Attributes

Google provides:
- `email` - User's email address
- `name` - Full name
- `given_name` - First name
- `family_name` - Last name
- `picture` - Profile photo URL

These are automatically mapped to Cognito attributes.

## Cost

**Free tier:**
- Google OAuth: FREE (unlimited)
- Cognito: First 50,000 MAUs FREE

## Troubleshooting

**Error: redirect_uri_mismatch**
- Verify redirect URIs in Google Console match exactly
- Include trailing slashes or not (be consistent)
- Wait 5 minutes after updating Google OAuth settings

**Error: invalid_client**
- Check Client ID and Secret in terraform.tfvars
- Ensure no extra spaces or quotes

**User not created in Cognito**
- Check Cognito logs in CloudWatch
- Verify attribute mapping in google-provider.tf

## Production Checklist

Before going to production:

1. **Publish OAuth consent screen** (remove test mode)
2. **Verify domain** in Google Console
3. **Add privacy policy URL**
4. **Add terms of service URL**
5. **Configure branding** (logo, colors)
6. **Set up monitoring** (CloudWatch alarms)

## Adding More Providers

To add other social logins (Facebook, Amazon, Apple), create similar files:
- `facebook-provider.tf`
- `amazon-provider.tf`
- `apple-provider.tf`

Each follows the same pattern as `google-provider.tf`.
