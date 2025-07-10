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