output "cognito_endpoint" {
  value       = aws_cognito_user_pool.user_pool.endpoint
}

output "cognito_user_pool_id" {
  value       = aws_cognito_user_pool.user_pool.id
}

# output "cognito_identity_pool_id" {
#   value       = aws_cognito_identity_pool.idp.id
# }

output "cognito_client_id" {
  value       = aws_cognito_user_pool_client.user_pool_client.id
}

output "cognito_provider_name" {
  value       = aws_cognito_identity_provider.idp_sso.provider_name
}
