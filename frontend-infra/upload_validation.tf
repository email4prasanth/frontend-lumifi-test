resource "null_resource" "cloudfront_invalidation" {
  triggers = {
    index = filesha256("index.html")
  }

  provisioner "local-exec" {
    command     = <<EOT
      aws cloudfront create-invalidation `
        --distribution-id ${aws_cloudfront_distribution.frontend.id} `
        --paths "/*" 
        # --profile lumifitest
    EOT
    interpreter = ["PowerShell", "-Command"]
  }

  depends_on = [aws_s3_object.index]
}