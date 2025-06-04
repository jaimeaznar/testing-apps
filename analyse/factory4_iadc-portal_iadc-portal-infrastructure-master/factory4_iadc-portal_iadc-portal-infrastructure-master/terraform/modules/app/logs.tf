resource "aws_cloudwatch_log_group" "confluence_public_viewer" {
  name              = "/ecs/iadc-portal-${var.env}-confluence-pv"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "iadc_portal" {
  name              = "/ecs/iadc-portal-${var.env}-portal"
  retention_in_days = 30
}
