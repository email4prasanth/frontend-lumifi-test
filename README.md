```sh
frontend-infra/
├── .github/
│   └── workflows/
│       └── dev-frontend.yml
└── backend.tf        # Separate state for frontend
├── locals.tf         # Frontend-specific locals
├── providers.tf
├── s3.tf             # Frontend S3 bucket only
├── cloudfront.tf
├── waf.tf
```