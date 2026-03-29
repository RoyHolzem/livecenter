# Google Identity Provider for Cognito

resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.livecenter.id
  provider_name = "Google"
  provider_type = "Google"
  
  # These will be provided via terraform.tfvars
  provider_details = {
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret
    authorize_scopes = "email openid profile"
  }
  
  # Map Google attributes to Cognito
  attribute_mapping = {
    email          = "email"
    username       = "sub"
    email_verified = "email_verified"
    name           = "name"
    given_name     = "given_name"
    family_name    = "family_name"
    picture        = "picture"
  }
}

# Add Google to supported identity providers
resource "aws_cognito_user_pool_client" "livecenter_web" {
  name                                 = "livecenter-web-${var.environment}"
  user_pool_id                         = aws_cognito_user_pool.livecenter.id
  generate_secret                      = false
  refresh_token_validity              = 30
  access_token_validity               = 1
  id_token_validity                   = 1
  
  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }
  
  # Explicit auth flows
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
  
  # Supported identity providers - NOW INCLUDES GOOGLE
  supported_identity_providers = [
    "COGNITO",
    "Google"
  ]
  
  # OAuth configuration
  callback_urls = [
    "https://${var.domain_name != "" ? var.domain_name : "main.${var.amplify_domain}"}",
    "http://localhost:3000"
  ]
  
  logout_urls = [
    "https://${var.domain_name != "" ? var.domain_name : "main.${var.amplify_domain}"}",
    "http://localhost:3000"
  ]
  
  default_redirect_uri = "https://${var.domain_name != "" ? var.domain_name : "main.${var.amplify_domain}"}"
  
  allowed_oauth_flows = [
    "code",
    "implicit"
  ]
  
  allowed_oauth_scopes = [
    "email",
    "openid",
    "profile"
  ]
  
  allowed_oauth_flows_user_pool_client = true
  
  # Read/write attributes
  read_attributes = [
    "email",
    "email_verified",
    "custom:role",
    "custom:team"
  ]
  
  write_attributes = [
    "email",
    "custom:role",
    "custom:team"
  ]
  
  prevent_user_existence_errors = "ENABLED"
}

# Variables for Google OAuth
variable "google_client_id" {
  description = "Google OAuth Client ID"
  type        = string
  default     = ""
}

variable "google_client_secret" {
  description = "Google OAuth Client Secret"
  type        = string
  sensitive   = true
  default     = ""
}

# Output Google login URL
output "cognito_google_login_url" {
  value = var.google_client_id != "" ? "https://${aws_cognito_user_pool_domain.livecenter.domain}.auth.${var.aws_region}.amazoncognito.com/oauth2/authorize?identity_provider=Google&response_type=code&client_id=${aws_cognito_user_pool_client.livecenter_web.id}&redirect_uri=https://${var.domain_name != "" ? var.domain_name : "main.${var.amplify_domain}"}" : "Set google_client_id and google_client_secret to enable Google login"
}
