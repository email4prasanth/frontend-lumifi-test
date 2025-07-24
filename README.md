```sh
frontend-infra/
├── .github/
│   └── workflows/
│       └── dev-frontend.yml
├── frontend-infra/
│   └── backend.tf        # Separate state for frontend
│   └── cloudfront.tf
│   └── locals.tf         # Frontend-specific locals
│   └── outputs.tf 
│   └── providers.tf
│   └── s3.tf             # Frontend S3 bucket only
│   └── waf.tf
├── public/
├── src/
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
```