# LiveCenter Infrastructure

This directory contains Infrastructure as Code for deploying LiveCenter to production.

## 🏗️ Architecture

LiveCenter can be deployed to multiple platforms:

- **AWS Amplify** (Recommended) - Simplest deployment
- **AWS S3 + CloudFront** - Static hosting with CDN
- **AWS ECS/Fargate** - Containerized deployment
- **Docker** - Self-hosted deployment

## 📋 Prerequisites

- AWS CLI configured (`aws configure`)
- Terraform >= 1.0
- Node.js >= 18
- npm or yarn

## 🚀 Quick Deploy

### Option 1: AWS Amplify (Recommended)

1. Push code to GitHub repository
2. Connect Amplify to repo:
   ```bash
   aws amplify create-app \
     --app-name livecenter \
     --repository https://github.com/YOUR_USERNAME/livecenter \
     --platform WEB
   ```
3. Add branch:
   ```bash
   aws amplify create-branch \
     --app-id <APP_ID> \
     --branch-name main
   ```

### Option 2: Terraform (Full Control)

```bash
# Initialize
cd infrastructure/terraform
terraform init

# Plan
terraform plan

# Apply
terraform apply
```

## 📁 Directory Structure

```
infrastructure/
├── terraform/
│   ├── main.tf              # Main Terraform configuration
│   ├── variables.tf          # Input variables
│   ├── outputs.tf            # Output values
│   ├── modules/
│   │   ├── amplify/          # Amplify deployment
│   │   ├── s3-cloudfront/    # S3 + CloudFront
│   │   └── ecs/              # Container deployment
│   └── environments/
│       ├── dev/
│       ├── staging/
│       └── prod/
├── docker/
│   ├── Dockerfile            # Production build
│   └── docker-compose.yml    # Local development
└── scripts/
    ├── deploy.sh             # Deployment script
    └── destroy.sh            # Cleanup script
```

## 🌍 Environments

| Environment | Branch   | Domain                       |
|-------------|----------|------------------------------|
| Development | develop  | dev.livecenter.yourdomain.com |
| Staging     | staging  | staging.livecenter.yourdomain.com |
| Production  | main     | livecenter.yourdomain.com     |

## 🔐 Secrets Management

Store secrets in AWS Secrets Manager or SSM Parameter Store:

```bash
# Create secret
aws secretsmanager create-secret \
  --name livecenter/api-keys \
  --secret-string '{"TELEPHONY_API_KEY":"xxx","EMAIL_API_KEY":"yyy"}'
```

Reference in Terraform:
```hcl
data "aws_secretsmanager_secret_version" "api_keys" {
  secret_id = "livecenter/api-keys"
}
```

## 📊 Monitoring

All deployments include:

- CloudWatch metrics
- Error tracking
- Performance monitoring
- Real-time logs

## 💰 Cost Estimation

### AWS Amplify (Recommended)
- Build minutes: ~$0.01/build
- Hosting: ~$0.23/GB stored
- Data transfer: ~$0.15/GB
- **Estimated monthly:** $5-20 for typical usage

### S3 + CloudFront
- S3: ~$0.023/GB stored
- CloudFront: ~$0.085/GB transferred
- **Estimated monthly:** $10-50

### ECS/Fargate
- vCPU: ~$0.04/vCPU-hour
- Memory: ~$0.011/GB-hour
- **Estimated monthly:** $50-200

## 🔧 Configuration

### Environment Variables

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.livecenter.com
NEXT_PUBLIC_WS_URL=wss://ws.livecenter.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### Build Settings

Amplify automatically detects Next.js and uses optimal settings.

For manual configuration, see `amplify.yml` in the root directory.

## 📖 Next Steps

1. Choose deployment platform
2. Configure domain
3. Set up SSL certificate
4. Configure monitoring
5. Enable CI/CD

## 🆘 Troubleshooting

### Build Fails
```bash
# Check build logs
aws amplify list-jobs --app-id <APP_ID> --branch main
```

### Domain Issues
```bash
# Verify domain
aws amplify get-domain-association --app-id <APP_ID>
```

### Performance Issues
- Enable CloudFront caching
- Optimize bundle size
- Use CDN for static assets

## 📚 Additional Resources

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
