# Cognito User Pool for LiveCenter Authentication

resource "aws_cognito_user_pool" "livecenter" {
  name = "livecenter-users-${var.environment}"
  
  # Username configuration
  username_configuration {
    case_sensitive = false
  }
  
  # Auto-verified attributes
  auto_verified_attributes = ["email"]
  
  # Email configuration
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }
  
  # Password policy
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
    temporary_password_validity_days = 7
  }
  
  # Schema for custom attributes
  schema {
    attribute_data_type      = "String"
    name                     = "role"
    developer_only_attribute = false
    mutable                  = true
    required                 = false
    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }
  
  schema {
    attribute_data_type      = "String"
    name                     = "team"
    developer_only_attribute = false
    mutable                  = true
    required                 = false
    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }
  
  # Verification message
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "LiveCenter - Verify your email"
    email_message        = "Your verification code is {####}"
  }
  
  # Account recovery
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
  
  # Tags
  tags = {
    Project     = "LiveCenter"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# User Pool Domain
resource "aws_cognito_user_pool_domain" "livecenter" {
  domain       = "livecenter-${var.environment}-${random_string.domain.result}"
  user_pool_id = aws_cognito_user_pool.livecenter.id
}

# Random string for unique domain
resource "random_string" "domain" {
  length  = 6
  special = false
  upper   = false
}

# User Pool Client is defined in google-provider.tf with Google social login support

# Identity Pool (optional - for AWS resource access)
resource "aws_cognito_identity_pool" "livecenter" {
  identity_pool_name               = "livecenter-${var.environment}"
  allow_unauthenticated_identities = false
  
  cognito_identity_providers {
    client_id     = aws_cognito_user_pool_client.livecenter_web.id
    provider_name = "cognito-idp.${var.aws_region}.amazonaws.com/${aws_cognito_user_pool.livecenter.id}"
  }
  
  tags = {
    Project     = "LiveCenter"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# IAM Roles for Identity Pool
resource "aws_iam_role" "cognito_authenticated" {
  name = "livecenter-cognito-authenticated-${var.environment}"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.livecenter.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "authenticated"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role" "cognito_unauthenticated" {
  name = "livecenter-cognito-unauthenticated-${var.environment}"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = "cognito-identity.amazonaws.com"
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "cognito-identity.amazonaws.com:aud" = aws_cognito_identity_pool.livecenter.id
          }
          "ForAnyValue:StringLike" = {
            "cognito-identity.amazonaws.com:amr" = "unauthenticated"
          }
        }
      }
    ]
  })
}

# Attach policies to roles
resource "aws_cognito_identity_pool_roles_attachment" "livecenter" {
  identity_pool_id = aws_cognito_identity_pool.livecenter.id
  
  roles = {
    "authenticated"   = aws_iam_role.cognito_authenticated.arn
    "unauthenticated" = aws_iam_role.cognito_unauthenticated.arn
  }
}

# Outputs
output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.livecenter.id
}

output "cognito_user_pool_arn" {
  value = aws_cognito_user_pool.livecenter.arn
}

output "cognito_user_pool_client_id" {
  value = aws_cognito_user_pool_client.livecenter_web.id
}

output "cognito_identity_pool_id" {
  value = aws_cognito_identity_pool.livecenter.id
}

output "cognito_domain" {
  value = aws_cognito_user_pool_domain.livecenter.domain
}

output "cognito_login_url" {
  value = "https://${aws_cognito_user_pool_domain.livecenter.domain}.auth.${var.aws_region}.amazoncognito.com/login?response_type=code&client_id=${aws_cognito_user_pool_client.livecenter_web.id}&redirect_uri=https://${var.domain_name != "" ? var.domain_name : "main.${var.amplify_domain}"}"
}
