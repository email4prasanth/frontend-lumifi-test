# ### File: backend.tf ###
# # Terraform Remote Backend Configuration - S3 for frontend code
# terraform {
#   backend "s3" {
#     bucket  = "lumifitfstore"
#     key     = "frontend/terraform.tfstate"
#     region  = "us-east-1"
#     # profile = "lumifitest"
#   }
# }


# ### File: cloudfront.tf ###
# # CloudFront distribution for S3 frontend
# resource "aws_cloudfront_distribution" "frontend" {
#   # provider = aws.us_east_1
#   origin {
#     domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
#     origin_id   = "S3-${aws_s3_bucket.frontend.bucket}"

#     s3_origin_config {
#       origin_access_identity = aws_cloudfront_origin_access_identity.frontend.cloudfront_access_identity_path
#     }
#   }

#   enabled             = true
#   is_ipv6_enabled     = true
#   default_root_object = "index.html"
#   # aliases             = ["www.aitechlearn.xyz"]

#   default_cache_behavior {
#     allowed_methods  = ["GET", "HEAD", "OPTIONS"]
#     cached_methods   = ["GET", "HEAD"]
#     target_origin_id = "S3-${aws_s3_bucket.frontend.bucket}"

#     forwarded_values {
#       query_string = false
#       cookies {
#         forward = "none"
#       }
#     }

#     viewer_protocol_policy = "redirect-to-https"
#     min_ttl                = 0
#     default_ttl            = 3600
#     max_ttl                = 86400
#   }

#   price_class = "PriceClass_100"

#   restrictions {
#     geo_restriction {
#       restriction_type = "none"
#     }
#   }

#   viewer_certificate {
#     # acm_certificate_arn      = aws_acm_certificate.cdn_cert.arn
#     cloudfront_default_certificate = true
#   }
#   # Require when waf is enabled 
#   # web_acl_id = aws_wafv2_web_acl.cdn_waf.arn
#   tags = local.tags
# }

# # CloudFront Origin Access Identity (OAI)
# resource "aws_cloudfront_origin_access_identity" "frontend" {
#   # provider = aws.us_east_1
#   comment = "OAI for ${aws_s3_bucket.frontend.bucket}"
# }




# ### File: locals.tf ###
# locals {
#   aws_region = "us-east-1"
#   project_name = {
#     name = "lumifi"
#   }

#   tags = {
#     owner       = "lumifi"
#     environment = terraform.workspace
#   }
# }


# ### File: outputs.tf ###
# output "cloudfront_domain" {
#   value = aws_cloudfront_distribution.frontend.domain_name
# }

# output "s3_bucket_name" {
#   value = aws_s3_bucket.frontend.bucket
# }

# output "website_endpoint" {
#   value = aws_s3_bucket_website_configuration.frontend.website_endpoint
# }


# ### File: providers.tf ###
# # Terraform Block with Required Providers
# terraform {
#   required_providers {
#     aws = {
#       source  = "hashicorp/aws"
#       version = "~> 5.0"
#     }
#   }
# }
# # AWS Provider Configuration
# provider "aws" {
#   region  = local.aws_region
#   # profile = "lumifitest"
# }


# ### File: s3.tf ###
# # Create S3 Bucket for frontend
# resource "aws_s3_bucket" "frontend" {
#   bucket = "${local.project_name.name}-${terraform.workspace}-frontend-test"
#   tags   = local.tags
# }

# # Versioning enabled for frontend
# resource "aws_s3_bucket_versioning" "frontend" {
#   bucket = aws_s3_bucket.frontend.id
#   versioning_configuration {
#     status = "Enabled"
#   }
# }

# # Static website hosting enabled
# resource "aws_s3_bucket_website_configuration" "frontend" {
#   bucket = aws_s3_bucket.frontend.id

#   index_document {
#     suffix = "index.html"
#   }

#   error_document {
#     key = "error.html"
#   }
# }

# # Block ALL public access
# resource "aws_s3_bucket_public_access_block" "frontend" {
#   bucket = aws_s3_bucket.frontend.id

#   # block_public_acls       = true
#   # block_public_policy     = true
#   # ignore_public_acls      = true
#   # restrict_public_buckets = true
#   block_public_acls       = false
#   block_public_policy     = false
#   ignore_public_acls      = false
#   restrict_public_buckets = false
# }


# # CORS configuration
# resource "aws_s3_bucket_cors_configuration" "frontend" {
#   bucket = aws_s3_bucket.frontend.id

#   cors_rule {
#     allowed_headers = ["*"]
#     allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
#     allowed_origins = ["*"]
#     expose_headers  = ["ETag"]
#     max_age_seconds = 3000
#   }
# }

# # Frontend bucket policy allowing ONLY CloudFront access
# data "aws_iam_policy_document" "frontend_policy" {
#   # Statement 1: Allow full access for Terraform user
#   statement {
#     effect  = "Allow"
#     actions = ["s3:*"]
#     resources = [
#       aws_s3_bucket.frontend.arn,
#       "${aws_s3_bucket.frontend.arn}/*"
#     ]

#     principals {
#       type = "AWS"
#       # identifiers = ["*"]
#       identifiers = ["arn:aws:iam::180294218712:user/lumifi"]

#     }
#   }

#   # Statement 2: Minimal access for CloudFront
#   statement {
#     effect = "Allow"
#     actions = [
#       "s3:GetObject",
#       "s3:ListBucket"
#     ]
#     resources = [
#       aws_s3_bucket.frontend.arn,
#       "${aws_s3_bucket.frontend.arn}/*"
#     ]

#     principals {
#       type        = "AWS"
#       identifiers = [aws_cloudfront_origin_access_identity.frontend.iam_arn]
#     }
#   }
# }

# # Attach the policy to frontend bucket
# resource "aws_s3_bucket_policy" "frontend_public" {
#   bucket = aws_s3_bucket.frontend.id
#   policy = data.aws_iam_policy_document.frontend_policy.json
# }


# ### File: waf.tf ###
# # WAF for CloudFront
# resource "aws_wafv2_web_acl" "cdn_waf" {
#   # provider    = aws.us_east_1
#   name        = "${local.project_name.name}-${terraform.workspace}-frontend-waf"
#   description = "WAF for frontend CloudFront"
#   scope       = "CLOUDFRONT"

#   default_action {
#     allow {}
#   }

#   rule {
#     name     = "AWS-AWSManagedRulesCommonRuleSet"
#     priority = 0

#     override_action {
#       none {}
#     }

#     statement {
#       managed_rule_group_statement {
#         name        = "AWSManagedRulesCommonRuleSet"
#         vendor_name = "AWS"
#       }
#     }

#     visibility_config {
#       cloudwatch_metrics_enabled = true
#       metric_name                = "AWSCommonRules"
#       sampled_requests_enabled   = true
#     }
#   }

#   rule {
#     name     = "AWS-AWSManagedRulesAmazonIpReputationList"
#     priority = 1

#     override_action {
#       none {}
#     }

#     statement {
#       managed_rule_group_statement {
#         name        = "AWSManagedRulesAmazonIpReputationList"
#         vendor_name = "AWS"
#       }
#     }

#     visibility_config {
#       cloudwatch_metrics_enabled = true
#       metric_name                = "AWSIpReputationList"
#       sampled_requests_enabled   = true
#     }
#   }

#   rule {
#     name     = "AWS-AWSManagedRulesKnownBadInputsRuleSet"
#     priority = 2

#     override_action {
#       none {}
#     }

#     statement {
#       managed_rule_group_statement {
#         name        = "AWSManagedRulesKnownBadInputsRuleSet"
#         vendor_name = "AWS"
#       }
#     }

#     visibility_config {
#       cloudwatch_metrics_enabled = true
#       metric_name                = "AWSKnownBadInputs"
#       sampled_requests_enabled   = true
#     }
#   }
#   rule {
#     name     = "Email-Injection-Protection"
#     priority = 10

#     action {
#       block {}
#     }

#     statement {
#       regex_pattern_set_reference_statement {
#         arn = aws_wafv2_regex_pattern_set.email_injection.arn
#         field_to_match {
#           body {}
#         }
#         text_transformation {
#           priority = 0
#           type     = "NONE"
#         }
#       }
#     }

#     visibility_config {
#       cloudwatch_metrics_enabled = true
#       metric_name                = "EmailInjection"
#       sampled_requests_enabled   = true
#     }
#   }
#   visibility_config {
#     cloudwatch_metrics_enabled = true
#     metric_name                = "${local.project_name.name}-waf"
#     sampled_requests_enabled   = true
#   }
# }
# # New regex pattern set for email injection
# resource "aws_wafv2_regex_pattern_set" "email_injection" {
#   name        = "email-injection-patterns"
#   description = "Patterns to detect email injection attempts"
#   scope       = "CLOUDFRONT"

#   regular_expression {
#     regex_string = "(?i)(\\b)(mailto:|cc=|bcc=|content-type:|mime-version:|multipart/|\\[\\d+\\]\\s*?=)"
#   }
# }


