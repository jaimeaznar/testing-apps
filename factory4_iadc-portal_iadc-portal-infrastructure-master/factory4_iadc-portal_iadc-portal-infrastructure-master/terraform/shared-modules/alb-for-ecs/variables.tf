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

variable "alb_name" {
  description = "ALB name"
  default     = "alb"
}

variable "portal_port" {
  description = "Workload port on which the ALB target group should send traffic to"
  type        = number
}

variable "cpv_port" {
  description = "Workload port on which the ALB target group should send traffic to"
  type        = number
}

variable "alb_ssl_port" {
  description = "SSL port"
  default     = 443
}

variable "alb_ssl_cert" {
  description = "ARN of SSL certificate to attach to ALB"
  default     = "" # useful for first creation
}

variable "confluence_public_viewer_target_group" {
  description = "ALB target group for cpv"
  type        = string
}

variable "iadc_portal_target_group" {
  description = "ALB target group for portal"
  type        = string
}
