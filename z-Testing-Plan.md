## Frontend Infrastructure Testing Plan
1. S3 Bucket Validation
```sh
aws s3api list-buckets --profile lumifitest # Details of list of buckets
(aws s3api list-buckets --profile lumifitest | ConvertFrom-Json).Buckets.Name # List of buckets names only
aws s3api head-bucket --bucket lumifi-dev-frontend-test --profile lumifitest # Check bucket exists and properties
# Verify static website config
aws s3api get-bucket-website --bucket lumifi-dev-frontend-test --profile lumifitest
# Check bucket policy
aws s3api get-bucket-policy --bucket lumifi-dev-frontend-test --query Policy --output text --profile lumifitest | ConvertFrom-Json

```
2. CloudFront Distribution Check
```sh
# Get distribution status
$DIST_ID = (aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items[?@=='www.aitechlearn.xyz']].Id" --output text --profile lumifitest)
echo $DIST_ID # check it in the aws portal
aws cloudfront get-distribution --id $DIST_ID --profile lumifitest --query "Distribution.Status"
# Verify CloudFront-S3 integration
aws cloudfront get-distribution-config --id $DIST_ID --profile lumifitest --query "DistributionConfig.Origins.Items[0]"
```
3. TLS Certificate Validation
```sh
# Check certificate status
# List all certificates to find the correct ARN
aws acm list-certificates --profile lumifitest `
    --query "CertificateSummaryList[].{Domain:DomainName, ARN:CertificateArn, Status:Status}" `
    --output table
# Then use the ARN directly
aws acm describe-certificate `
  --certificate-arn $(aws acm list-certificates --query "CertificateSummaryList[?DomainName=='aitechlearn.xyz'].[CertificateArn][*]" --output text --profile lumifitest) `
  --query "{DomainName: Certificate.DomainName, Validations: Certificate.DomainValidationOptions[*].{ValidationDomain: DomainName, ValidationStatus: ValidationStatus}}" `
  --profile lumifitest
```
- Expected output
```sh
{
    "DomainName": "aitechlearn.xyz",
    "Validations": [
        {
            "ValidationDomain": "aitechlearn.xyz",
            "ValidationStatus": "SUCCESS"
        },
        {
            "ValidationDomain": "*.aitechlearn.xyz",
            "ValidationStatus": "SUCCESS"
        }
    ]
}
```
4. WAF Protection Verification
```sh
# Confirm WAF is attached
aws cloudfront get-distribution --id $DIST_ID --profile lumifitest --query "Distribution.DistributionConfig.WebACLId"
aws wafv2 list-web-acls --scope CLOUDFRONT --profile lumifitest --query "WebACLs[*].{Name:Name, Id:Id}" 
$WAF_ID = (aws wafv2 list-web-acls --scope CLOUDFRONT --profile lumifitest | ConvertFrom-Json).WebACLs.Id
echo $WAF_ID
aws wafv2 get-web-acl `
  --name lumifi-dev-frontend-waf `
  --id $WAF_ID   `
  --scope CLOUDFRONT `
  --region us-east-1 `
  --profile lumifitest `
  --query "WebACL.Rules[*].{Name:Name, Priority:Priority}" `
  --output table
```
5. DNS Resolution Test
```sh
nslookup www.aitechlearn.xyz
curl https://www.aitechlearn.xyz -v
# Check CloudFront domain resolution
Resolve-DnsName -Name $(aws cloudfront get-distribution --id $DIST_ID --query "Distribution.DomainName" --output text --profile lumifitest)
```
6. Connectivity & Security Checks
```sh
# Test HTTPS access
curl -I https://www.aitechlearn.xyz
# Verify TLS version
openssl s_client -connect www.aitechlearn.xyz:443 -tls1_2
# Check for open ports
Test-NetConnection www.aitechlearn.xyz -Port 443
```

7. Database & Backend Health Checks (Without Application)
8. Lamnbda
```sh
aws lambda get-function --function-name lumifi-dev-processor --profile lumifitest
```
### Remove variables
```sh
Remove-Variable DIST_ID
Remove-Variable WAF_ID
```