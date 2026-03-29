# Cognito Authentication Setup Guide

## What This Creates

This Terraform configuration sets up **AWS Cognito authentication** for LiveCenter:

### Resources Created:
1. **Cognito User Pool** - User directory and authentication
2. **User Pool Client** - Web app client configuration
3. **User Pool Domain** - Hosted UI for login/signup
4. **Identity Pool** - AWS resource access (optional)
5. **IAM Roles** - Authenticated/Unauthenticated user roles

### Features:
✅ Email-based signup/login
✅ Password reset
✅ Email verification
✅ Custom user attributes (role, team)
✅ Secure password policy
✅ OAuth 2.0 support
✅ JWT token authentication

## Deployment Steps

### Prerequisites:
- Terraform >= 1.0 installed
- AWS CLI configured with credentials
- GitHub Personal Access Token

### Step 1: Create Terraform Backend

Create S3 bucket and DynamoDB table for Terraform state:

```bash
# Create S3 bucket
aws s3 mb s3://livecenter-terraform-state --region eu-central-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket livecenter-terraform-state \
  --versioning-configuration Status=Enabled

# Create DynamoDB table for locks
aws dynamodb create-table \
  --table-name livecenter-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region eu-central-1
```

### Step 2: Configure Variables

```bash
cd infrastructure/terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` and add your GitHub token:
```hcl
github_token = "ghp_YOUR_TOKEN_HERE"
```

### Step 3: Initialize Terraform

```bash
terraform init
```

### Step 4: Review Plan

```bash
terraform plan
```

This will show you all resources that will be created.

### Step 5: Apply

```bash
terraform apply
```

Type `yes` when prompted.

### Step 6: Get Outputs

After successful deployment:

```bash
terraform output
```

You'll get:
- `cognito_user_pool_id` - User Pool ID
- `cognito_user_pool_client_id` - App Client ID
- `cognito_identity_pool_id` - Identity Pool ID
- `cognito_login_url` - Direct login URL

## What Happens Next

Once deployed:

1. **Cognito is created** - Ready to accept users
2. **Amplify gets environment variables** - Frontend can connect
3. **Test login URL** - Visit the `cognito_login_url` output

### Test User Signup:

```bash
# Create a test user via AWS CLI
aws cognito-idp sign-up \
  --client-id $(terraform output -raw cognito_user_pool_client_id) \
  --username test@example.com \
  --password TestPass123! \
  --user-attributes Name=email,Value=test@example.com Name="custom:role",Value=agent Name="custom:team",Value=Alpha \
  --region eu-central-1

# Confirm user (for testing)
aws cognito-idp admin-confirm-sign-up \
  --user-pool-id $(terraform output -raw cognito_user_pool_id) \
  --username test@example.com \
  --region eu-central-1
```

## Frontend Integration (Next Steps)

To use this in your Next.js app, you'll need to add:

1. **Install AWS Amplify SDK**:
```bash
npm install aws-amplify @aws-amplify/ui-react
```

2. **Configure Amplify** (in `src/lib/amplify.ts`):
```typescript
import { Amplify } from 'aws-amplify'

Amplify.configure({
  Auth: {
    region: process.env.NEXT_PUBLIC_COGNITO_REGION,
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
  },
})
```

3. **Add login component** (simplified example):
```typescript
import { withAuthenticator } from '@aws-amplify/ui-react'

function App({ signOut, user }) {
  return (
    <div>
      <h1>Hello {user.username}</h1>
      <button onClick={signOut}>Sign out</button>
      {/* Your dashboard */}
    </div>
  )
}

export default withAuthenticator(App)
```

## Customization

### Add More Attributes:

Edit `infrastructure/terraform/cognito.tf`:

```hcl
schema {
  attribute_data_type      = "String"
  name                     = "department"
  developer_only_attribute = false
  mutable                  = true
  required                 = false
}
```

### Add Social Login (Google, Facebook):

```hcl
resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.livecenter.id
  provider_name = "Google"
  provider_type = "Google"
  
  provider_details = {
    client_id        = "YOUR_GOOGLE_CLIENT_ID"
    client_secret    = "YOUR_GOOGLE_CLIENT_SECRET"
    authorize_scopes = "email openid profile"
  }
  
  attribute_mapping = {
    email    = "email"
    username = "sub"
  }
}
```

## Security Best Practices

✅ **Password policy** enforced (8+ chars, mixed case, numbers, symbols)
✅ **Email verification** required
✅ **Token expiration** (1 hour access, 30 days refresh)
✅ **MFA ready** (can be enabled if needed)
✅ **Secure secrets** (no secrets in code)

## Cost

Cognito pricing (eu-central-1):
- **First 50,000 MAUs**: FREE
- **50,001-100,000 MAUs**: $0.0055 per MAU
- **Beyond**: See AWS pricing

For typical call center (< 1000 users): **~$0/month**

## Troubleshooting

### "Bucket already exists" error:
```bash
# Use a unique bucket name
aws s3 mb s3://livecenter-terraform-state-$(date +%s)
```

### "GitHub token invalid":
- Verify token has `repo` scope
- Check token isn't expired

### "User not confirmed":
```bash
aws cognito-idp admin-confirm-sign-up \
  --user-pool-id USER_POOL_ID \
  --username test@example.com \
  --region eu-central-1
```

## Clean Up

To remove all resources:

```bash
terraform destroy
```

⚠️ **Warning**: This deletes all users and data!

---

Need help? Check AWS docs:
- [Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)
- [Amplify Authentication](https://docs.amplify.aws/lib/auth/getting-started/)
