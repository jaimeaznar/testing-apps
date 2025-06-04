terraform {
  source = "${get_parent_terragrunt_dir()}/../modules//app" # double slash (//) is required
}

include {
  path = find_in_parent_folders()
}

dependency "alb" {
  config_path = "../01-alb"

  mock_outputs = { # needed when you perform "terraform validate|plan" on a new infra
    alb_sg           = "sg-DUMMY-alb"
    alb_target_group = "arn:aws:elasticloadbalancing:eu-west-1:999999999999:targetgroup/DUMMY/999"
  }
}

dependency "cognito" {
  config_path = "../03-cognito"
}

# Variable values from dependencies
# See modules/this-module/variables.tf for documentation
inputs = {
  sg_confluence_public_viewer_alb = dependency.alb.outputs.alb_sg
  alb_target_group_portal         = lookup(dependency.alb.outputs, "portal_alb_target_group", "arn:aws:elasticloadbalancing:eu-west-1:874706906285:targetgroup/portal-alb-target_group/69cb739a007431cc")
  alb_target_group_cpv            = lookup(dependency.alb.outputs, "cpv_alb_target_group", "arn:aws:elasticloadbalancing:eu-west-1:874706906285:targetgroup/cpv-alb-target-group/5354395c7e8d47e6")
  GITLAB_TOKEN                    = get_env("GITLAB_TOKEN", "default")
  cognito_client_id               = lookup(dependency.cognito.outputs, "cognito_client_id", "")
  INSTANA_AGENT_KEY               = get_env("INSTANA_AGENT_KEY", "default")
  INSTANA_FRONTEND_API_KEY        = get_env("TF_VAR_INSTANA_FRONTEND_API_KEY", "default")
  google_analytics_private_key    = get_env("GOOGLE_ANALYTICS_PRIVATE_KEY", "default")
  google_analytics_client_email   = get_env("GOOGLE_ANALYTICS_CLIENT_EMAIL", "default")
  viewer_confluence_api_token     = get_env("TF_VAR_VIEWER_CONFLUENCE_API_TOKEN", "default")
  viewer_system_jira_api_token    = get_env("TF_VAR_VIEWER_SYSTEM_JIRA_API_TOKEN", "default")
  viewer_mce_jira_api_token       = get_env("TF_VAR_viewer_mce_jira_api_token", "default")
  api_matomo_token                = get_env("TF_VAR_api_matomo_token", "default")
  viewer_jira_reader_api_token    = get_env("TF_VAR_VIEWER_JIRA_READER_API_TOKEN", "default")
}
