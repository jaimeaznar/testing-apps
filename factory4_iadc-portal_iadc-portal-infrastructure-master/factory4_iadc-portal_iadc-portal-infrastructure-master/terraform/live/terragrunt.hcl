locals {
  # Warning: this name is used in remote_state S3 bucket name. Do not forget to change it if you are copy/pasting this project
  project_name = "iadc-portal"
  aws_region   = "eu-west-1"

  default_yaml_path = find_in_parent_folders("empty.yml")

  env = get_env("TF_VAR_env", "integration") # "integration" by default to avoid mistakes when developping locally
}

remote_state {
  backend = "s3"
  config = {
    bucket         = "sanofi-iadc-digitaltools-${local.env}-tfstate-${local.project_name}"
    key            = "${path_relative_to_include()}/terraform.tfstate.json"
    region         = local.aws_region
    encrypt        = true
    dynamodb_table = "${local.project_name}-${local.env}-tfstatelock"
  }
}

# Configure root level variables that all resources can inherit
# We do not use .tfvar files because of this issue: https://github.com/gruntwork-io/terragrunt/issues/873
# Solution: we use .vars.yml files. Under the hood, Terragrunt generates TF_VAR_xxx environment variables from them
# Source: https://github.com/gruntwork-io/terragrunt-infrastructure-live-example/blob/master/prod/terragrunt.hcl
#
# Files are evaluated/overriden into this order (the later takes predecence):
# 0. Inputs defined in this file (main terragrunt.hcl)
# 1. /live/common.vars.yml
# 2. /live/**/common.vars.yml
# 3. /live/<TF_VAR_env>.vars.yml
# 4. /live/**/<TF_VAR_env>.vars.yml
#
inputs = merge(
  {
    project_name : local.project_name,
    aws_region : local.aws_region,
    env : local.env
  },
  yamldecode(
    file("${find_in_parent_folders("common.vars.yml", local.default_yaml_path)}"),
  ),
  yamldecode(fileexists("${get_terragrunt_dir()}/common.vars.yml") ? file("${get_terragrunt_dir()}/common.vars.yml") : "{}"),
  yamldecode(
    file("${find_in_parent_folders("${local.env}.vars.yml", local.default_yaml_path)}"),
  ),
  yamldecode(fileexists("${get_terragrunt_dir()}/${local.env}.vars.yml") ? file("${get_terragrunt_dir()}/${local.env}.vars.yml") : "{}")
)
