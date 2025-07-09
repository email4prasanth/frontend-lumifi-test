# Get hosted zone
data "aws_route53_zone" "domain" {
  name         = "aitechlearn.xyz."
  private_zone = false
}

# Frontend (CloudFront)
resource "aws_route53_record" "frontend" {
  zone_id = data.aws_route53_zone.domain.zone_id
  name    = "www.aitechlearn.xyz"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend.domain_name
    zone_id                = aws_cloudfront_distribution.frontend.hosted_zone_id
    evaluate_target_health = false
  }
}