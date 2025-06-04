resource "aws_ecr_repository" "confluence_public_viewer" {
  name = "iadc-portal-${var.env}-konviw"
}

resource "aws_ecs_task_definition" "confluence_public_viewer" {
  family                   = "iadc-portal-${var.env}-confluence-pv"
  execution_role_arn       = var.ecs_task_execution_role_name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu_viewer
  memory                   = var.fargate_memory_viewer

  container_definitions = <<DEFINITION
[
  {
    "image": "${var.viewer_image}",
    "name": "iadc-portal-${var.env}-konviw",
    "cpu": ${var.fargate_cpu_viewer},
    "memory": ${var.fargate_memory_viewer},
    "networkMode": "awsvpc",
    "portMappings": [
      {
        "containerPort": 3000,
        "hostPort": ${var.cpv_port}
      }
    ],
    "environment": [
      {
        "name": "NODE_ENV",
        "value": "${var.viewer_node_env}"
      },
      {
        "name": "CPV_LOG_LEVEL",
        "value": "${var.viewer_log_level}"
      },
      {
        "name": "CPV_BASEPATH",
        "value": "${var.viewer_basepath}"
      },
      {
        "name": "CPV_CONFLUENCE_BASE_URL",
        "value": "${var.viewer_confluence_base_url}"
      },
      {
        "name": "CPV_CONFLUENCE_API_USERNAME",
        "value": "${var.viewer_confluence_api_username}"
      },
      {
        "name": "CPV_BASEHOST",
        "value": "${var.portal_iadc_portal_base_url}"
      },
      {
        "name": "CPV_PAGE_CACHE_TIMEOUT",
        "value": "${var.viewer_page_cache_timeout}"
      },
      {
        "name": "CACHE_TTL",
        "value": "${var.viewer_page_cache_ttl}"
      },
      {
        "name": "CACHE_MAX",
        "value": "${var.viewer_page_cache_max}"
      },
      {
        "name": "CPV_JIRA_System_JIRA_BASE_URL",
        "value": "${var.viewer_system_jira_base_url}"
      },
      {
        "name": "CPV_JIRA_System_JIRA_API_USERNAME",
        "value": "${var.viewer_system_jira_api_username}"
      },
      {
        "name": "CPV_JIRA_MCE_JIRA_BASE_URL",
        "value": "${var.viewer_mce_jira_base_url}"
      },
      {
        "name": "CPV_JIRA_MCE_JIRA_API_USERNAME",
        "value": "${var.viewer_mce_jira_api_username}"
      },
      {
        "name": "CPV_KONVIW_PRIVATE_PAGE",
        "value": "${var.viewer_konviw_private_page}"
      },
      {
        "name": "INSTANA_ENDPOINT_URL",
        "value": "${var.instana_endpoint_url}"
      },
      {
        "name": "INSTANA_ZONE",
        "value": "${var.project_name}-${var.env}"
      },
      {
        "name": "INSTANA_TRACING_TRANSMISSION_DELAY",
        "value": "${var.instana_tracing_transmission_delay}"
      },
      {
        "name": "INSTANA_METRICS_TRANSMISSION_DELAY",
        "value": "${var.instana_metrics_transmission_delay}"
      },
      {
        "name": "INSTANA_AUTO_PROFILE",
        "value": "true"
      },
      {
        "name": "CPV_GOOGLE_ANALYTICS",
        "value": "${var.viewer_google_analytics}"
      },
      {
        "name": "CPV_JIRA_READER_API_USERNAME",
        "value": "${var.viewer_jira_reader_api_username}"
      },
      {
        "name": "CPV_CONFLUENCE_EMOJI_COLLECTION",
        "value": "${var.viewer_confluence_emoji_collection}"
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
          "awslogs-group": "${aws_cloudwatch_log_group.confluence_public_viewer.id}",
          "awslogs-region": "${var.aws_region}",
          "awslogs-stream-prefix": "viewer-${var.env}"
      }
    },
    "secrets": [
      {
        "name": "CPV_CONFLUENCE_API_TOKEN",
        "valueFrom": "${aws_secretsmanager_secret.confluence_api_token.arn}"
      },
      {
        "name": "CPV_JIRA_System_JIRA_API_TOKEN",
        "valueFrom": "${aws_secretsmanager_secret.system_jira_api_token.arn}"
      },
      {
        "name": "CPV_JIRA_MCE_JIRA_API_TOKEN",
        "valueFrom": "${aws_secretsmanager_secret.mce_jira_api_token.arn}"
      },
      {
        "name": "INSTANA_AGENT_KEY",
        "valueFrom": "${aws_secretsmanager_secret.portal_instana_agent_key.arn}"
      },
      {
        "name": "INSTANA_FRONTEND_API_KEY",
        "valueFrom": "${aws_secretsmanager_secret.portal_instana_frontend_api_key.arn}"
      },
      {
        "name": "CPV_JIRA_READER_API_TOKEN",
        "valueFrom": "${aws_secretsmanager_secret.jira_reader_api_token.arn}"
      }
    ]
  }
]
DEFINITION
}

resource "aws_ecs_service" "confluence_public_viewer" {
  name                              = "iadc-portal-${var.env}-confluence-pv"
  cluster                           = aws_ecs_cluster.iadc_portal.id
  task_definition                   = aws_ecs_task_definition.confluence_public_viewer.arn
  desired_count                     = 2
  launch_type                       = "FARGATE"
  health_check_grace_period_seconds = "300"

  network_configuration {
    security_groups = [
      aws_security_group.confluence_public_viewer_service.id, # to allow incoming traffic from the ALB
      var.sg_webproxy                                         # to allow usage of webproxy
    ]
    subnets          = var.subnets
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.alb_target_group_cpv
    container_name   = "iadc-portal-${var.env}-konviw"
    container_port   = 3000
  }
}
