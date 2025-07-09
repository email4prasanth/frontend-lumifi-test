```sh
frontend-infra/
├── .github/
│   └── workflows/
│       └── dev-frontend.yml
└── backend.tf        # Separate state for frontend
├── locals.tf         # Frontend-specific locals
├── providers.tf
├── s3.tf             # Frontend S3 bucket only


├── acm.tf            # CloudFront cert only
├── cloudfront.tf
├── route53.tf        # Frontend DNS records
├── waf.tf
```