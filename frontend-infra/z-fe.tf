# ### File: acm.tf ###
# # CloudFront Certificate 
# resource "aws_acm_certificate" "cdn_cert" {
#   # provider          = aws.us_east_1
#   domain_name       = "aitechlearn.xyz"
#   validation_method = "DNS"

#   subject_alternative_names = [
#     "aitechlearn.xyz",
#     "*.aitechlearn.xyz"
#   ]

#   lifecycle {
#     create_before_destroy = true
#   }
# }

# # DNS Validation for CloudFront Certificate
# resource "aws_route53_record" "cdn_cert_validation" {
#   for_each = {
#     for dvo in aws_acm_certificate.cdn_cert.domain_validation_options : dvo.domain_name => {
#       name   = dvo.resource_record_name
#       record = dvo.resource_record_value
#       type   = dvo.resource_record_type
#     }
#   }

#   allow_overwrite = true
#   name            = each.value.name
#   records         = [each.value.record]
#   ttl             = 60
#   type            = each.value.type
#   zone_id         = data.aws_route53_zone.domain.zone_id
# }

# # Certificate Validation for CloudFront
# resource "aws_acm_certificate_validation" "cdn_cert" {
#   # provider                = aws.us_east_1
#   certificate_arn         = aws_acm_certificate.cdn_cert.arn
#   validation_record_fqdns = [for record in aws_route53_record.cdn_cert_validation : record.fqdn]
# }


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
#   aliases             = ["www.aitechlearn.xyz"]

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
#     acm_certificate_arn      = aws_acm_certificate.cdn_cert.arn
#     ssl_support_method       = "sni-only"
#     minimum_protocol_version = "TLSv1.2_2021"
#   }

#   web_acl_id = aws_wafv2_web_acl.cdn_waf.arn
#   tags       = local.tags
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

#   # tags = merge({
#   #   owner       = "lumifi"
#   #   environment = terraform.workspace
#   # }, {
#   #   CostCenter  = "Frontend"
#   #   DataClass   = "Public"
#   # })
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


# ### File: route53.tf ###
# # Get hosted zone
# data "aws_route53_zone" "domain" {
#   name         = "aitechlearn.xyz."
#   private_zone = false
# }

# # Frontend (CloudFront)
# resource "aws_route53_record" "frontend" {
#   zone_id = data.aws_route53_zone.domain.zone_id
#   name    = "www.aitechlearn.xyz"
#   type    = "A"

#   alias {
#     name                   = aws_cloudfront_distribution.frontend.domain_name
#     zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
#     evaluate_target_health = false
#   }
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


# ### File: upload_validation.tf ###

# # # use for testing in powershell
# # resource "null_resource" "cloudfront_invalidation" {
# #   triggers = {
# #     index = filesha256("index.html")
# #   }

# #   provisioner "local-exec" {
# #     command     = <<EOT
# #       aws cloudfront create-invalidation `
# #         --distribution-id ${aws_cloudfront_distribution.frontend.id} `
# #         --paths "/*" 
# #         # --profile lumifitest
# #     EOT
# #     interpreter = ["PowerShell", "-Command"]
# #   }

# #   depends_on = [aws_s3_object.index]
# # }

# # use for testing when it is yml cicd
# resource "null_resource" "cloudfront_invalidation" {
#   triggers = {
#     index = filesha256("index.html")
#   }

#   provisioner "local-exec" {
#     command = <<EOT
#       aws cloudfront create-invalidation \
#         --distribution-id ${aws_cloudfront_distribution.frontend.id} \
#         --paths "/*"
#     EOT
#     interpreter = ["/bin/bash", "-c"]
#   }

#   depends_on = [aws_s3_object.index]
# }


# ### File: upload.tf ###
# # Upload index.html
# resource "aws_s3_object" "index" {
#   bucket       = aws_s3_bucket.frontend.id
#   key          = "index.html"
#   content      = file("${path.module}/index.html")
#   content_type = "text/html"
# }

# # Upload error.html
# resource "aws_s3_object" "error" {
#   bucket       = aws_s3_bucket.frontend.id
#   key          = "error.html"
#   source       = "error.html"
#   content_type = "text/html"
#   etag         = filemd5("error.html")
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


