terraform {
  source = "${get_parent_terragrunt_dir()}/../shared-modules//alb-for-ecs" # double slash (//) is required
}

include {
  path = find_in_parent_folders()
}
