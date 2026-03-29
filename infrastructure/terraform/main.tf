# Terraform Configuration for LiveCenter

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket         = "livecenter-terraform-state-1774814850"
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
  value = var.amplify_app_id
}

output "amplify_app_url" {
  value = "https://main.${var.amplify_domain}"
}

# Variables for existing Amplify app
variable "amplify_app_id" {
  description = "Existing Amplify App ID"
  type        = string
  default     = "dl5iyvnws81xx"
}

variable "amplify_domain" {
  description = "Amplify default domain"
  type        = string
  default     = "dl5iyvnws81xx.amplifyapp.com"
}
