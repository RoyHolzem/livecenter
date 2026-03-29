# Additional Social Login Providers
# Note: Cognito natively supports Google, Facebook, Amazon, and Apple
# GitHub and Discord require custom OIDC setup (see SOCIAL_LOGIN_GUIDE.md)

# For now, this file is a placeholder for future custom OIDC providers
# To add GitHub/Discord, you would need to:
# 1. Set up custom OIDC provider
# 2. Configure attribute mapping
# 3. Add to supported_identity_providers list

# Example for custom OIDC provider:
# resource "aws_cognito_identity_provider" "custom_oidc" {
#   user_pool_id  = aws_cognito_user_pool.livecenter.id
#   provider_name = "CustomProvider"
#   provider_type = "OIDC"
#
#   provider_details = {
#     client_id                = var.custom_client_id
#     client_secret            = var.custom_client_secret
#     authorize_scopes         = "openid email profile"
#     attributes_request_method = "GET"
#     oidc_issuer              = "https://custom-provider.com"
#   }
#
#   attribute_mapping = {
#     email    = "email"
#     username = "sub"
#   }
# }
