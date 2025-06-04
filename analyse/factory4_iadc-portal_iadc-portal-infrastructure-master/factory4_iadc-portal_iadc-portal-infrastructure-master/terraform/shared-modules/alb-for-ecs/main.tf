terraform {
  backend "s3" {} # will be filled by Terragrunt
}

provider "aws" {
  region = var.aws_region
  version = "5.70.0"
}
