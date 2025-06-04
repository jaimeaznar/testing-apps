resource "aws_cognito_user_pool_domain" "main" {
  domain       = var.cognito_domain
  user_pool_id = aws_cognito_user_pool.user_pool.id
}

resource "aws_cognito_user_pool" "user_pool" {
  name = var.cognito_pool
#  lambda_config {
#    pre_token_generation = aws_lambda_function.dpcm_cognito_trigger_ad.arn
#    # pre_authentication = aws_lambda_function.fact_cognito_pre_auth.arn
#  }
}

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name = var.cognito_client
  generate_secret = false
  user_pool_id = aws_cognito_user_pool.user_pool.id
  callback_urls = ["${var.APP_URL}/callback", "${var.APP_URL_OLD}/callback", "http://localhost:8080/callback", "http://localhost/callback"]
  logout_urls = ["${var.APP_URL}/logout", "${var.APP_URL_OLD}/logout", "http://localhost:8080/logout", "http://localhost/logout"]
  allowed_oauth_scopes = ["openid", "profile", "email"]
  allowed_oauth_flows = ["code","implicit"]
  allowed_oauth_flows_user_pool_client = true
  explicit_auth_flows = ["ALLOW_CUSTOM_AUTH", "ALLOW_ADMIN_USER_PASSWORD_AUTH", "ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
  supported_identity_providers = [aws_cognito_identity_provider.idp_sso.provider_name, "COGNITO"]
  lifecycle {
    ignore_changes = [generate_secret]
  }
}

resource "aws_cognito_resource_server" "resource_server" {
  identifier = "https://docs.sanofi.com"
  name       = "IADC Portal API"
  user_pool_id = aws_cognito_user_pool.user_pool.id

  scope {
    scope_name        = "access:full"
    scope_description = "Full Access Rights"
  }
}

resource "aws_cognito_user_pool_client" "client_m2m" {
  name = var.cognito_client_m2m
  generate_secret = true
  user_pool_id = aws_cognito_user_pool.user_pool.id
  allowed_oauth_scopes = ["${aws_cognito_resource_server.resource_server.identifier}/access:full"]
  allowed_oauth_flows = ["client_credentials"]
  allowed_oauth_flows_user_pool_client = true
  explicit_auth_flows = ["ALLOW_CUSTOM_AUTH", "ALLOW_ADMIN_USER_PASSWORD_AUTH", "ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
  depends_on = [aws_cognito_resource_server.resource_server]
  lifecycle {
    ignore_changes = [generate_secret]
  }
}

resource "aws_cognito_identity_provider" "idp_sso" {
  user_pool_id  = aws_cognito_user_pool.user_pool.id
  provider_name = "sanofi-sso"
  provider_type = "SAML"

  provider_details = {
    MetadataFile = file(var.cognito_saml_metadata_path)
  }

  attribute_mapping = {
    name    = "name"
    family_name = "lastname"
    email = "emailaddress"
    given_name = "firstname"
    nickname = "DisplayName"
    profile = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    preferred_username = "Samaccountname"
    zoneinfo = "Department"
    address = "city"
    locale = "co"
  }
}

# resource "aws_cognito_identity_pool" "idp" {
#   identity_pool_name               = var.identity_pool_name
#   allow_unauthenticated_identities = false

#   cognito_identity_providers {
#     client_id               = aws_cognito_user_pool_client.user_pool_client.id
#     provider_name           = "cognito-idp.eu-west-1.amazonaws.com/${aws_cognito_user_pool.user_pool.id}"
#     server_side_token_check = false
#   }
# }

# resource "aws_cognito_identity_pool_roles_attachment" "idp_role" {
#   identity_pool_id = aws_cognito_identity_pool.idp.id
#   roles = {
#     "authenticated" = var.cognito_auth_role
#   }
# }
