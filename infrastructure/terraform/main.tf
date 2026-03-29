# Terraform Configuration for LiveCenter

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket         = "livecenter-terraform-state"
    key            = "livecenter/terraform.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    dynamodb_table = "livecenter-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "LiveCenter"
      ManagedBy   = "Terraform"
      Environment = var.environment
    }
  }
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "livecenter"
}

variable "github_repository" {
  description = "GitHub repository URL"
  type        = string
}

variable "github_token" {
  description = "GitHub personal access token"
  type        = string
  sensitive   = true
}

variable "domain_name" {
  description = "Custom domain name"
  type        = string
  default     = ""
}

# Outputs
output "amplify_app_id" {
  value = aws_amplify_app.livecenter.id
}

output "amplify_app_url" {
  value = "https://${var.environment}.${aws_amplify_app.livecenter.default_domain}"
}

# Amplify App
resource "aws_amplify_app" "livecenter" {
  name       = "${var.app_name}-${var.environment}"
  repository = var.github_repository
  
  # GitHub token
  access_token = var.github_token
  
  # Build settings
  build_spec = <<-YAML
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
  YAML
  
  # Environment variables
  environment_variables = {
    ENV                             = var.environment
    NEXT_PUBLIC_ENVIRONMENT         = var.environment
    NEXT_PUBLIC_COGNITO_REGION      = var.aws_region
    NEXT_PUBLIC_COGNITO_USER_POOL_ID = aws_cognito_user_pool.livecenter.id
    NEXT_PUBLIC_COGNITO_CLIENT_ID    = aws_cognito_user_pool_client.livecenter_web.id
    NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID = aws_cognito_identity_pool.livecenter.id
  }
  
  # Enable auto build
  enable_auto_build = true
  
  # Enable branch auto detection
  enable_branch_auto_build = true
  
  # Platform
  platform = "WEB"
}

# Main branch
resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.livecenter.id
  branch_name = "main"
  
  stage            = "PRODUCTION"
  framework        = "Next.js"
  enable_auto_build = true
}

# Staging branch (if needed)
resource "aws_amplify_branch" "staging" {
  app_id      = aws_amplify_app.livecenter.id
  branch_name = "staging"
  
  stage            = "STAGING"
  framework        = "Next.js"
  enable_auto_build = true
  
  count = var.environment == "production" ? 1 : 0
}

# Custom domain (optional)
resource "aws_amplify_domain_association" "livecenter" {
  app_id      = aws_amplify_app.livecenter.id
  domain_name = var.domain_name
  
  # Wait for verification
  wait_for_verification = true
  
  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = ""
  }
  
  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "www"
  }
  
  count = var.domain_name != "" ? 1 : 0
}
