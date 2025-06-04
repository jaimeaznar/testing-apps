terraform {
  source = "${get_parent_terragrunt_dir()}/../modules//cognito" # double slash (//) is required
}

include {
  path = find_in_parent_folders()
}

dependency "alb" {
  config_path = "../01-alb"
}

inputs = {
  sg_app                = dependency.alb.outputs.alb_sg
}