locals {
  aws_region = "us-east-1"
  project_name = {
    name = "lumifi"
  }

  tags = {
    owner       = "lumifi"
    environment = terraform.workspace
  }

  # tags = merge({
  #   owner       = "lumifi"
  #   environment = terraform.workspace
  # }, {
  #   CostCenter  = "Frontend"
  #   DataClass   = "Public"
  # })
}