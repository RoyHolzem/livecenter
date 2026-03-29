# Complete Social Login Guide for LiveCenter

LiveCenter supports modern authentication with multiple providers:

## ✅ Supported Providers

| Provider | Status | Setup Time | Cost |
|----------|--------|------------|------|
| **Email/Password** | ✅ Built-in | 0 min | FREE |
| **Google** | ✅ Ready | 10 min | FREE |
| **GitHub** | ⚙️ Custom OIDC | 15 min | FREE |
| **Discord** | ⚙️ Custom OIDC | 15 min | FREE |
| **Facebook** | 📝 Available | 10 min | FREE |
| **Amazon** | 📝 Available | 10 min | FREE |
| **Apple** | 📝 Available | 20 min | FREE |

---

## 🚀 Quick Setup (Email + Google)

### 1. Email/Password (Already Working)
No setup required! Users can sign up with email immediately.

**Test it:**
```bash
aws cognito-idp sign-up \
  --client-id 58rolqun12sg15evv6mv0l3u2m \
  --username test@example.com \
  --password TestPass123! \
  --user-attributes Name=email,Value=test@example.com \
  --region eu-central-1
```

### 2. Google Login (Recommended)

**Step 1: Create Google OAuth App**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Create OAuth client ID → Web application
3. Add authorized redirect URIs:
   ```
   https://livecenter-production-6p4sdh.auth.eu-central-1.amazoncognito.com/oauth2/idpresponse
   https://main.dl5iyvnws81xx.amplifyapp.com
   http://localhost:3000
   ```
4. Copy **Client ID** and **Client Secret**

**Step 2: Configure Terraform**
```bash
cd infrastructure/terraform
```

Edit `terraform.tfvars`:
```hcl
google_client_id     = "YOUR_CLIENT_ID.apps.googleusercontent.com"
google_client_secret = "YOUR_GOOGLE_CLIENT_SECRET"
```

**Step 3: Apply**
```bash
terraform apply
```

**Step 4: Test**
Visit your login URL:
```
https://livecenter-production-6p4sdh.auth.eu-central-1.amazoncognito.com/login?response_type=code&client_id=58rolqun12sg15evv6mv0l3u2m&redirect_uri=https://main.dl5iyvnws81xx.amplifyapp.com
```

You'll see a "Sign in with Google" button!

---

## 🔧 Advanced: GitHub Login

**Note:** Requires custom OIDC setup

### Option A: Direct OIDC (Advanced)

1. **Create GitHub OAuth App:**
   - Go to: https://github.com/settings/developers
   - OAuth Apps → New OAuth App
   - Authorization callback URL:
     ```
     https://livecenter-production-6p4sdh.auth.eu-central-1.amazoncognito.com/oauth2/idpresponse
     ```

2. **Configure Custom OIDC Provider:**
   Requires custom Terraform module or manual AWS Console setup

3. **Alternative:** Use Auth0 or Okta as identity broker

### Option B: Use Auth0 (Recommended for GitHub/Discord)

**Why Auth0?**
- Native GitHub/Discord support
- Easy integration
- Free tier: 7,000 MAU

**Setup:**
1. Create Auth0 account
2. Enable GitHub/Discord connections
3. Configure Auth0 as SAML provider in Cognito
4. Users authenticate via Auth0 → Cognito

**Cost:** FREE for < 7,000 users

---

## 🎮 Discord Login

**Option A: Direct (Advanced)**
Similar to GitHub - requires custom OIDC

**Option B: Auth0 (Recommended)**
Easiest path - Auth0 has native Discord support

---

## 📱 Facebook Login

1. **Create Facebook App:**
   - https://developers.facebook.com/apps/
   - Add Facebook Login product
   - Settings → Basic → Copy App ID and Secret

2. **Configure OAuth:**
   - Valid OAuth Redirect URIs:
     ```
     https://livecenter-production-6p4sdh.auth.eu-central-1.amazoncognito.com/oauth2/idpresponse
     ```

3. **Add to Terraform:**
   ```hcl
   resource "aws_cognito_identity_provider" "facebook" {
     user_pool_id  = aws_cognito_user_pool.livecenter.id
     provider_name = "Facebook"
     provider_type = "Facebook"
     
     provider_details = {
       client_id        = var.facebook_app_id
       client_secret    = var.facebook_app_secret
       authorize_scopes = "email"
     }
     
     attribute_mapping = {
       email = "email"
       name  = "name"
     }
   }
   ```

---

## 🍎 Apple Sign In

**Required for iOS apps (App Store requirement)**

1. **Create App ID:**
   - https://developer.apple.com/account/resources/identifiers/list
   - Register App ID with Sign In with Apple capability

2. **Create Services ID:**
   - Configure redirect URLs
   - Download private key

3. **Add to Terraform:**
   ```hcl
   resource "aws_cognito_identity_provider" "apple" {
     user_pool_id  = aws_cognito_user_pool.livecenter.id
     provider_name = "SignInWithApple"
     provider_type = "SignInWithApple"
     
     provider_details = {
       client_id     = var.apple_services_id
       team_id       = var.apple_team_id
       key_id        = var.apple_key_id
       private_key   = var.apple_private_key
       authorize_scopes = "email name"
     }
   }
   ```

---

## 🎨 Frontend Integration

### Install AWS Amplify

```bash
npm install aws-amplify @aws-amplify/ui-react
```

### Configure Amplify

```typescript
// src/lib/amplify.ts
import { Amplify } from 'aws-amplify'

Amplify.configure({
  Auth: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_ycn9oj84y',
    userPoolWebClientId: '58rolqun12sg15evv6mv0l3u2m',
    oauth: {
      domain: 'livecenter-production-6p4sdh.auth.eu-central-1.amazoncognito.com',
      scope: ['email', 'openid', 'profile'],
      redirectSignIn: 'https://main.dl5iyvnws81xx.amplifyapp.com',
      redirectSignOut: 'https://main.dl5iyvnws81xx.amplifyapp.com',
      responseType: 'code'
    }
  }
})
```

### Login Component

```tsx
// src/components/Login.tsx
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

export default function Login() {
  return (
    <Authenticator
      socialProviders={['google', 'facebook', 'amazon']}
    >
      {({ signOut, user }) => (
        <div>
          <h1>Welcome {user?.username}</h1>
          <button onClick={signOut}>Sign Out</button>
        </div>
      )}
    </Authenticator>
  )
}
```

### Custom Social Buttons

```tsx
import { signInWithRedirect } from 'aws-amplify/auth'

// Google login
<button onClick={() => signInWithRedirect({ provider: 'Google' })}>
  Sign in with Google
</button>

// Facebook login
<button onClick={() => signInWithRedirect({ provider: 'Facebook' })}>
  Sign in with Facebook
</button>
```

---

## 🔐 Security Best Practices

### 1. Environment Variables
Never commit secrets! Use:

```bash
# In terraform.tfvars (add to .gitignore)
google_client_secret     = "SECRET_VALUE"
facebook_app_secret      = "SECRET_VALUE"
apple_private_key        = "SECRET_VALUE"

# Or use AWS Secrets Manager
aws secretsmanager create-secret \
  --name livecenter/oauth-secrets \
  --secret-string file://secrets.json
```

### 2. Callback URL Validation
Only allow:
- Your production domain
- localhost for development (remove in production)

### 3. Scope Minimization
Only request scopes you need:
- ✅ `email openid profile` (minimal)
- ❌ `https://www.googleapis.com/auth/gmail.readonly` (too much)

### 4. HTTPS Only
Ensure all redirect URIs use HTTPS (except localhost)

---

## 📊 Cost Breakdown

| Service | Free Tier | After Free Tier |
|---------|-----------|-----------------|
| Cognito | 50,000 MAU | $0.0055/MAU |
| Google OAuth | Unlimited | FREE |
| GitHub OAuth | Unlimited | FREE |
| Discord OAuth | Unlimited | FREE |
| Auth0 | 7,000 MAU | $23/1000 MAU |

**Estimated cost for 1,000 users:** $0/month (within free tiers)

---

## 🧪 Testing Checklist

- [ ] Email signup works
- [ ] Email verification received
- [ ] Password reset works
- [ ] Google login button appears
- [ ] Google login creates user
- [ ] User attributes populated (name, email, picture)
- [ ] Session persists across refresh
- [ ] Logout works
- [ ] Error handling works
- [ ] Redirect URIs correct

---

## 🐛 Troubleshooting

### "redirect_uri_mismatch"
- Check redirect URIs in OAuth provider
- Must match EXACTLY (including trailing slashes)
- Wait 5 minutes for propagation

### "Invalid Client"
- Verify Client ID and Secret
- Check for extra spaces or quotes
- Ensure credentials are for correct environment

### "User not created"
- Check CloudWatch logs
- Verify attribute mapping
- Check required attributes

### "Token expired"
- Access tokens expire in 1 hour
- Use refresh token to get new access token
- Amplify SDK handles this automatically

---

## 📚 Next Steps

1. **Enable Google login** (10 min)
2. **Test thoroughly**
3. **Add frontend integration**
4. **Enable other providers** as needed
5. **Set up monitoring** (CloudWatch)
6. **Add user roles/permissions**

---

## 🆘 Need Help?

**AWS Cognito Docs:**
- https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-identity-provider.html

**Provider Docs:**
- Google: https://developers.google.com/identity/protocols/oauth2
- GitHub: https://docs.github.com/en/developers/apps/building-oauth-apps
- Discord: https://discord.com/developers/docs/topics/oauth2

**Community:**
- AWS Forums: https://forums.aws.amazon.com/forum.jspa?forumID=207
- Stack Overflow: `[amazon-cognito]` tag
