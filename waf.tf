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

#   visibility_config {
#     cloudwatch_metrics_enabled = true
#     metric_name                = "${local.project_name.name}-waf"
#     sampled_requests_enabled   = true
#   }
# }