output "alb_sg" {
  value       = aws_security_group.alb.id
  description = "ALB security group"
}

output "portal_alb_target_group" {
  value       = aws_alb_target_group.portal.id
  description = "Portal ALB target group"
}

output "cpv_alb_target_group" {
  value       = aws_alb_target_group.cpv.id
  description = "CPV ALB target group"
}
