terraform {
  backend "s3" {} # will be filled by Terragrunt
}

provider "aws" {
  region = var.aws_region
  version = "~> 3.0,!= 3.14.0"
}
