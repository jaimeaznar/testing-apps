resource "aws_alb" "main" {
  name = "${var.project_name}-${var.env}-${var.alb_name}"

  internal = true # Because this VPC is not exposed to Sanofi LAN.
  # Instead, this ALB is targetted by an HAProxy located in the peered SharedServices VPC of ITS

  load_balancer_type         = "application"
  subnets                    = var.subnets
  enable_deletion_protection = true
  idle_timeout               = "4000"

  security_groups = [
    aws_security_group.alb.id # to allow incoming traffic
  ]
}

resource "aws_alb_target_group" "portal" { # usually referenced by ECS services
  name        = var.iadc_portal_target_group
  port        = var.portal_port
  protocol    = "HTTP"
  vpc_id      = var.vpc
  target_type = "ip"

  health_check {
    healthy_threshold   = "2"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200-399"
    timeout             = "5"
    path                = "/"
    unhealthy_threshold = "2"
  }
}

resource "aws_alb_target_group" "cpv" { # usually referenced by ECS services
  name        = var.confluence_public_viewer_target_group
  port        = var.cpv_port
  protocol    = "HTTP"
  vpc_id      = var.vpc
  target_type = "ip"

  health_check {
    healthy_threshold   = "2"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200-399"
    timeout             = "5"
    path                = "/cpv/health"
    unhealthy_threshold = "2"
  }
}

resource "aws_alb_listener" "portal_cpv" {
  count = var.alb_ssl_cert != "" ? 1 : 0 # useful for first creation

  load_balancer_arn = aws_alb.main.id
  port              = var.alb_ssl_port
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.alb_ssl_cert
  default_action {
    target_group_arn = aws_alb_target_group.portal.id
    type             = "forward"
  }
}

resource "aws_alb_listener_rule" "cpv" {
  listener_arn = aws_alb_listener.portal_cpv[0].id
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.cpv.id
  }

  condition {
    path_pattern {
      values = ["/cpv*"]
    }
  }
  depends_on = [aws_alb_listener.portal_cpv[0]]
}

resource "aws_lb_listener" "redirect" {
  load_balancer_arn = aws_alb.main.id
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = var.alb_ssl_port
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}