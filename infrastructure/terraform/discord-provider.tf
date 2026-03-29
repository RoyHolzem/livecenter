# Discord Social Login
# Note: Discord requires custom OIDC setup

# Discord doesn't have native Cognito support, so we document how to add it manually
# See SOCIAL_LOGIN_GUIDE.md for details

# For production Discord integration, consider:
# 1. Using Auth0 or similar service as middleware
# 2. Building custom Lambda trigger
# 3. Using third-party identity broker

# Example custom OIDC for Discord (requires custom implementation):
# resource "aws_cognito_identity_provider" "discord" {
#   user_pool_id  = aws_cognito_user_pool.livecenter.id
#   provider_name = "Discord"
#   provider_type = "OIDC"
#   
#   provider_details = {
#     client_id                = var.discord_oauth_client_id
#     client_secret            = var.discord_oauth_client_secret
#     authorize_scopes         = "identify email"
#     attributes_request_method = "GET"
#     oidc_issuer              = "https://discord.com"
#   }
#   
#   attribute_mapping = {
#     email    = "email"
#     username = "username"
#   }
#   
#   count = var.discord_oauth_client_id != "" ? 1 : 0
# }
