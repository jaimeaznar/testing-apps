resource "aws_ecr_repository" "iadc_portal" {
  name = "iadc-portal-${var.env}-portal"
}

resource "aws_ecs_task_definition" "iadc_portal" {
  family                   = "iadc-portal-${var.env}-portal"
  execution_role_arn       = var.ecs_task_execution_role_name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu_portal
  memory                   = var.fargate_memory_portal

  container_definitions = <<DEFINITION
[
  {
    "image": "${var.portal_image}",
    "name": "iadc-portal-${var.env}-portal",
    "cpu": ${var.fargate_cpu_portal},
    "memory": ${var.fargate_memory_portal},
    "networkMode": "awsvpc",
    "portMappings": [
      {
        "containerPort": 80,
        "hostPort": ${var.portal_port}
      }
    ],
    "environment": [
      {
        "name": "NODE_ENV",
        "value": "${var.portal_node_env}"
      },
      {
        "name": "PORTAL_LOG_LEVEL",
        "value": "${var.portal_log_level}"
      },
      {
        "name": "VUE_APP_CONFLUENCE_READER_BASE_URL",
        "value": "${var.portal_confluence_reader_base_url}"
      },
      {
        "name": "VUE_APP_CONFLUENCE_READER_BASE_API",
        "value": "${var.portal_confluence_reader_base_api}"
      },
      {
        "name": "VUE_APP_MATOMO_BASE_URL",
        "value": "${var.viewer_matomo_base_url}"
      },
      {
        "name": "VUE_APP_WHISPR_BASE_URL",
        "value": "${var.portal_whispr_base_url}"
      },
      {
        "name": "VUE_APP_WHISPR_BASE_WS",
        "value": "${var.portal_whispr_base_ws}"
      },
      {
        "name": "VERSION_SRM_ENV",
        "value": "${var.VERSION_SRM_ENV}"
      },
      {
        "name": "VERSION_ENV",
        "value": "${var.VERSION_ENV}"
      },
      {
        "name": "VUE_APP_COGNITO_APP_DOMAIN",
        "value": "${var.cognito_app_domain}"
      },
      {
        "name": "VUE_APP_COGNITO_CLIENT_ID",
        "value": "${var.cognito_client_id}"
      },
      {
        "name": "VUE_APP_COGNITO_PROVIDER_NAME",
        "value": "${var.cognito_provider_name}"
      },
      {
        "name": "VUE_APP_GOOGLE_ANALYTICS_ID",
        "value": "${var.portal_google_analytics_id}"
      },
      {
        "name": "VUE_APP_GOOGLE_ANALYTICS_PRIVATE_KEY",
        "value": "${var.google_analytics_private_key}"
      },
      {
        "name": "VUE_APP_GOOGLE_ANALYTICS_CLIENT_EMAIL",
        "value": "${var.google_analytics_client_email}"
      },
      {
        "name": "VUE_APP_FEATURE_JIRA_ISSUE_ENABLED",
        "value": "${var.feature_jira_issue_enabled}"
      },
      {
        "name": "VUE_APP_CONFLUENCE_API_USERNAME",
        "value": "${var.viewer_confluence_api_username}"
      },
      {
        "name": "VUE_APP_CONFLUENCE_BASE_URL",
        "value": "${var.viewer_confluence_base_url}"
      },
      {
        "name": "VUE_APP_SELF_SERVICE_STRUCTURE_PAGE_ID",
        "value": "${var.portal_self_service_structure_page_id}"
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
          "awslogs-group": "${aws_cloudwatch_log_group.iadc_portal.id}",
          "awslogs-region": "${var.aws_region}",
          "awslogs-stream-prefix": "portal-${var.env}"
      }
    },
    "secrets": [
      {
        "name": "VUE_APP_API_MATOMO_TOKEN",
        "valueFrom": "${aws_secretsmanager_secret.api_matomo_token.arn}"
      },
      {
        "name": "GITLAB_TOKEN",
        "valueFrom": "${aws_secretsmanager_secret.gitlab_token.arn}"
      },
      {
        "name": "VUE_APP_INSTANA_API_KEY",
        "valueFrom": "${aws_secretsmanager_secret.portal_instana_frontend_api_key.arn}"
      },
      {
        "name": "VUE_APP_CONFLUENCE_API_TOKEN",
        "valueFrom": "${aws_secretsmanager_secret.confluence_api_token.arn}"
      }
    ]
  }
]
DEFINITION
}

resource "aws_ecs_service" "iadc_portal" {
  name                              = "iadc-portal-${var.env}-portal"
  cluster                           = aws_ecs_cluster.iadc_portal.id
  task_definition                   = aws_ecs_task_definition.iadc_portal.arn
  desired_count                     = 2
  launch_type                       = "FARGATE"
  health_check_grace_period_seconds = "300"

  network_configuration {
    security_groups = [
      aws_security_group.iadc_portal_service.id, # to allow incoming traffic from the ALB
      var.sg_webproxy                                         # to allow usage of webproxy
    ]
    subnets          = var.subnets
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.alb_target_group_portal
    container_name   = "iadc-portal-${var.env}-portal"
    container_port   = 80
  }
}
