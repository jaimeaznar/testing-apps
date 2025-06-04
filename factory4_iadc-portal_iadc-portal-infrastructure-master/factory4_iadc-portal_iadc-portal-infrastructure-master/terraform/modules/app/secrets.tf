resource "aws_secretsmanager_secret" "confluence_api_token" {
  name = "iadc-portal-${var.env}-confluence-api-token"
}

resource "aws_secretsmanager_secret_version" "confluence_api_token" {
  secret_id     = aws_secretsmanager_secret.confluence_api_token.id
  secret_string = var.viewer_confluence_api_token
}

resource "aws_secretsmanager_secret" "system_jira_api_token" {
  name = "iadc-portal-${var.env}-system-jira-api-token"
}

resource "aws_secretsmanager_secret_version" "system_jira_api_token" {
  secret_id     = aws_secretsmanager_secret.system_jira_api_token.id
  secret_string = var.viewer_system_jira_api_token
}

resource "aws_secretsmanager_secret" "mce_jira_api_token" {
  name = "iadc-portal-${var.env}-mce-jira-api-token"
}

resource "aws_secretsmanager_secret_version" "mce_jira_api_token" {
  secret_id     = aws_secretsmanager_secret.mce_jira_api_token.id
  secret_string = var.viewer_mce_jira_api_token
}

resource "aws_secretsmanager_secret" "api_matomo_token" {
  name = "iadc-portal-${var.env}-api-matomo-token"
}

resource "aws_secretsmanager_secret_version" "api_matomo_token" {
  secret_id     = aws_secretsmanager_secret.api_matomo_token.id
  secret_string = var.api_matomo_token
}

resource "aws_secretsmanager_secret" "gitlab_token" {
  name = "GITLAB_TOKEN"
}

resource "aws_secretsmanager_secret_version" "gitlab_token_value" {
  secret_id     = aws_secretsmanager_secret.gitlab_token.id
  secret_string = var.GITLAB_TOKEN
}

resource "aws_secretsmanager_secret" "portal_instana_agent_key" {
  name = "INSTANA_AGENT_KEY"
}
resource "aws_secretsmanager_secret" "portal_instana_frontend_api_key" {
  name = "INSTANA_FRONTEND_AGENT_KEY"
}

resource "aws_secretsmanager_secret_version" "portal_instana_api_key_value" {
  secret_id     = aws_secretsmanager_secret.portal_instana_agent_key.id
  secret_string = var.INSTANA_AGENT_KEY
}

resource "aws_secretsmanager_secret_version" "portal_instana_frontend_api_key_value" {
  secret_id     = aws_secretsmanager_secret.portal_instana_frontend_api_key.id
  secret_string = var.INSTANA_FRONTEND_API_KEY
}
resource "aws_secretsmanager_secret" "jira_reader_api_token" {
  name = "iadc-portal-${var.env}-jira-reader-api-token"
}
resource "aws_secretsmanager_secret_version" "jira_reader_api_token" {
  secret_id     = aws_secretsmanager_secret.jira_reader_api_token.id
  secret_string = var.viewer_jira_reader_api_token
}