# IADC Portal Infrastructure

This is the infrastructure repository for the deployment of [Confluence public viewer](https://emea-aws-gitlab.sanofi.com:3001/factory4/digital-foundation/iadc-portal/confluence-public-viewer).

This repository follows the [IADC Release Strategy implementation guidelines](https://iadc.atlassian.net/wiki/spaces/IADC/pages/429326377/Implementation+guidelines+of+the+IADC+Release+Strategy).

## Environments

-   Development: https://iadc-docs-dev.sanofi.com
-   Production: https://iadc-docs.sanofi.com

## Local development

The typical development workflow is:

1. Develop
2. Test the Terraform deployment to the development environment locally (at least perform a `terragrunt plan`)
3. When satisfied, merge the changes to `master`, which will trigger the CI/CD pipeline to deploy again to the development environment
4. Merge to `release`, which will deploy to production with CI/CD

Before starting deploying from your machine, you must:

-   Have [Terraform installed](https://learn.hashicorp.com/terraform/getting-started/install.html)
-   Have [Terragrunt installed](https://terragrunt.gruntwork.io/docs/getting-started/install/)
-   Have [AWS CLI installed, `aws-saml` script installed and assumed the correct role](https://iadc.atlassian.net/wiki/spaces/IADC/pages/156499983/Use+AWS+CLI+in+sanofi). Those temporary credentials will be stored in a named profile, let's say `digitaltools-dev`

### Terraform / Terragrunt usage

We use a wrapper around Terraform which is called Terragrunt. It enables to split easily a Terraform project into sub-stacks, which
is a good practice, especially for resources that have different life cycle (ie. an ECS cluster vs its RDS database).
Terragrunt also handles automatic remote state S3 bucket creation.

**You can execute commands globally:**

```bash
AWS_PROFILE=digitaltools-dev terragrunt <global-command>
```

Where `global-command` can be: `validate-all`, `plan-all`, `apply-all`...

**Or into each sub-stack:**

```bash
cd live/<sub-stack>
AWS_PROFILE=digitaltools-dev terragrunt <command>
```

Where `command` can be: `validate`, `plan`, `apply`...

## Useful procedures

### Import a Sanofi SSL certificate

This procedure should be followed after receiving a `.p12` file from https://pki-ra.sanofi-aventis.com for the ALB SSL termination.

```bash
openssl pkcs12 -in <application-name>.sanofi.com.p12 -nocerts -nodes -out /tmp/private-key.pem
openssl pkcs12 -in <application-name>.sanofi.com.p12 -clcerts -nokeys -out /tmp/certificate.pem
AWS_PROFILE=<your-aws-profile> aws acm import-certificate \
    --private-key file:///tmp/private-key.pem \
    --certificate file:///tmp/certificate.pem \
    --certificate-chain file://~/.ssh/sanofi-cacerts.pem # downloadable on https://pki-ra.sanofi-aventis.com/EE/ca-import.cgi
```

The last command returns the imported certificate ARN, that you can then set in the `alb_ssl_cert` variable.

## ADR

### Creation

This repository was forked from [cachet](https://emea-aws-gitlab.sanofi.com:3001/factory4/digital-foundation/cachet) and [dummy product infrastructure](https://emea-aws-gitlab.sanofi.com:3001/factory4/digital-foundation/examples/dummy-product/dummy-product-infrastructure).
