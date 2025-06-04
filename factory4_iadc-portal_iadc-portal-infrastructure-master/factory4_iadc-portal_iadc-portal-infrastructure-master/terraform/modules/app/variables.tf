variable "project_name" {
  description = "Terraform project name. Used to name resources according to our naming convention"
  type        = string
}

variable "env" {
  description = "Environment name. Used to name resources according to our naming convention"
  type        = string
}

variable "aws_region" {
  description = "The AWS region"
  type        = string
}

variable "vpc" {
  description = "VPC ID"
  type        = string
}

variable "subnets" {
  description = "VPC subnets to use"
  type        = list(string)
}

variable "sg_webproxy" {
  description = "Webproxy security group ID"
  type        = string
}

variable "sg_confluence_public_viewer_alb" {
  description = "ALB security group ID"
  type        = string
}

variable "fargate_cpu_viewer" {
  description = "CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = "1024"
}

variable "fargate_memory_viewer" {
  description = "Memory to provision (in MiB)"
  default     = "2048"
}

# *** Viewer variables ****

variable "viewer_image" {
  description = "Viewer Docker image to use. Should be stored on ECR because Docker Hub is not accessible from our VPC"
  type        = string
}

variable "viewer_node_env" {
  description = "NODE_ENV environment name"
  type        = string
}

variable "viewer_log_level" {
  description = "Viewer log level"
  default     = "info"
}

variable "viewer_basepath" {
  description = "Viewer basepath"
  default     = "/cpv"
}

variable "viewer_confluence_base_url" {
  type = string
}

variable "viewer_confluence_api_username" {
  type = string
}

variable "viewer_matomo_base_url" {
  type = string
}

variable "viewer_google_analytics" {
  type = string
}

variable "viewer_system_jira_base_url" {
  type = string
}

variable "viewer_system_jira_api_username" {
  type = string
}

variable "viewer_mce_jira_base_url" {
  type = string
}

variable "viewer_mce_jira_api_username" {
  type = string
}

variable "viewer_confluence_api_token" {
  type = string
}

variable "viewer_konviw_private_page" {
  type = string
}

variable "viewer_system_jira_api_token" {
  type = string
}

variable "viewer_mce_jira_api_token" {
  type = string
}

variable "viewer_jira_reader_api_username" {
  type = string
}

variable "viewer_jira_reader_api_token" {
  type = string
}

# Default page cache timeout is 1 day
variable "viewer_page_cache_timeout" {
  type    = number
  default = 86400
}

variable "viewer_page_cache_ttl" {
  type    = number
  default = 86400
}

variable "viewer_page_cache_max" {
  type    = number
  default = 86400
}

# *****iadc portal variables ********

variable "portal_image" {
  description = "Viewer Docker image to use. Should be stored on ECR because Docker Hub is not accessible from our VPC"
  type        = string
}

variable "portal_node_env" {
  description = "NODE_ENV environment name"
  type        = string
}

variable "portal_log_level" {
  description = "Viewer log level"
  default     = "info"
}

variable "portal_iadc_portal_base_url" {
  type = string
}

variable "portal_confluence_reader_base_url" {
  type = string
}

variable "portal_confluence_reader_base_api" {
  type = string
}

variable "api_matomo_token" {
  type = string
}

variable "portal_whispr_base_url" {
  type = string
}

variable "portal_whispr_base_ws" {
  type = string
}

variable "VERSION_SRM_ENV" {
  type = string
}
variable "VERSION_ENV" {
  type = string
}
variable "GITLAB_TOKEN" {
  type = string
}

variable "cognito_app_domain" {
  type = string
}

variable "cognito_client_id" {
  type = string
}

variable "cognito_provider_name" {
  type = string
}

variable "ecs_task_execution_role_name" {
  description = "Role associated to each ECS task. Usually contains policies so tasks are able to push logs, read secrets, pull docker images from ECR, etc. Named App_ecsTaskExecutionRole at Sanofi"
  type        = string
}

variable "fargate_cpu_portal" {
  description = "CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = "1024"
}

variable "fargate_memory_portal" {
  description = "Memory to provision (in MiB)"
  default     = "2048"
}

variable "alb_target_group_cpv" {
  type = string
}

variable "alb_target_group_portal" {
  type = string
}

variable "portal_port" {
  description = "Workload port on which the ALB target group should send traffic to"
  type        = number
}

variable "cpv_port" {
  description = "Workload port on which the ALB target group should send traffic to"
  type        = number
}

variable "portal_google_analytics_id" {
  type = string
}

# ***** instana variables ********

variable "INSTANA_AGENT_KEY" {
  type = string
 }
variable "instana_endpoint_url" {
  type = string
 }
variable "INSTANA_FRONTEND_API_KEY" {
  type = string
 }
variable "instana_tracing_transmission_delay" {
  type = string
  description = "poll rate for instana tracing"
}
variable "instana_metrics_transmission_delay" {
  type = string
  description = "poll rate for instana metric"
}

variable "google_analytics_private_key" {
  type = string
}

variable "google_analytics_client_email" {
  type = string
}

variable "feature_jira_issue_enabled" {
  type = string
  description = "Set this value to 'enable' to enable the Jira Issue Page"
}

variable "portal_self_service_structure_page_id" {
  type = string
}

variable "viewer_confluence_emoji_collection" {
  type = string
}
