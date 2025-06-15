# Terraform Remote Backend Configuration - S3 for frontend code
terraform {
  backend "s3" {
    bucket  = "lumifitfstore"
    key     = "frontend/terraform.tfstate"
    region  = local.aws_region
    # profile = "lumifitest"
  }
}