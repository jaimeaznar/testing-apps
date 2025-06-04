resource "aws_secretsmanager_secret" "m2m_client_secret" {
  name = "IADC_PORTAL_COGNITO_M2M_CLIENT_SECRET"
}

resource "aws_secretsmanager_secret_version" "m2m_client_secret_value" {
  secret_id     = aws_secretsmanager_secret.m2m_client_secret.id
  secret_string = aws_cognito_user_pool_client.client_m2m.client_secret
}
