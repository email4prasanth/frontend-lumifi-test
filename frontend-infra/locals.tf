locals {
  aws_region = "us-east-1"
  project_name = {
    name = "lumifi"
  }

  tags = {
    owner       = "lumifi"
    environment = terraform.workspace
  }
}