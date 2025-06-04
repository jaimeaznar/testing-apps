resource "aws_security_group" "alb" {
  name   = "${var.project_name}-${var.env}-${var.alb_name}"
  vpc_id = var.vpc

  ingress {
    from_port   = var.alb_ssl_port
    to_port     = var.alb_ssl_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
