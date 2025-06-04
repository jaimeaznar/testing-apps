resource "aws_ecs_cluster" "iadc_portal" {
  name = "iadc-portal-${var.env}"
}
