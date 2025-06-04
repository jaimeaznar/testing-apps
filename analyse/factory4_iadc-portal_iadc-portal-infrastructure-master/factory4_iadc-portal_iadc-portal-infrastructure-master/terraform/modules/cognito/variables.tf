variable "aws_region" {
  description = "The AWS region"
  type = string
}

#variable "sg_default" {
#    type = string
#}

variable "sg_app" {
    type = string
}

variable "subnets" {
    type = list(string)
}

variable "vpc" {
    type = string
}
variable "lambda_role_name" {
  type = string
}

variable "lambda_payload_path" {
  type = string
}
variable "lambda_function_name_cognito_trigger_ad" {
  type = string
}
variable "lambda_function_name_cognito_pre_auth" {
  type = string
}
variable "lambda_handler_ad_trigger" {
  type = string
}
variable "lambda_handler_pre_auth_trigger" {
  type = string
}

variable "lambda_timeout" {
  type = number
}

variable "lambda_memory_size" {
  type = number
}

variable "APP_URL" {
    type = string
}
variable "APP_URL_OLD" {
    type = string
}
variable "cognito_auth_role" {
    type = string
}
variable "admin_group" {
  type = string
}
variable "identity_pool_name" {
  type = string
}
variable "cognito_domain" {
  type = string
}
variable "cognito_pool" {
  type = string
}
variable "cognito_client" {
  type = string
}
variable "cognito_client_m2m" {
  type = string
}
variable "cognito_saml_metadata_path" {
  type = string
}
