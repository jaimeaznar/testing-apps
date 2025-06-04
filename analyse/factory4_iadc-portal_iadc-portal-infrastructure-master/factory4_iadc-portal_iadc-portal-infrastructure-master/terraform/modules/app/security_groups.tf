resource "aws_security_group" "confluence_public_viewer_service" {
  name   = "iadc-portal-${var.env}-confluence-pv-service"
  vpc_id = var.vpc

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [var.sg_confluence_public_viewer_alb]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "iadc_portal_service" {
  name   = "iadc-portal-${var.env}-portal-service"
  vpc_id = var.vpc

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [var.sg_confluence_public_viewer_alb]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
