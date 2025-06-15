```sh
frontend-infra/
├── .github/
│   └── workflows/
│       └── dev-frontend.yml
├── acm.tf            # CloudFront cert only
└── backend.tf        # Separate state for frontend
├── cloudfront.tf
├── locals.tf         # Frontend-specific locals
├── providers.tf
├── route53.tf        # Frontend DNS records
├── s3.tf             # Frontend S3 bucket only
├── waf.tf
```