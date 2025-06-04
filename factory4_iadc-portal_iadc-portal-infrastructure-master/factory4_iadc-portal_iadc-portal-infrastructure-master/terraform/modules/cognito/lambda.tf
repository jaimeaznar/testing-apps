# resource "aws_lambda_function" "dpcm_cognito_trigger_ad" {
#   filename = var.lambda_payload_path
#   function_name = var.lambda_function_name_cognito_trigger_ad
#   role = var.lambda_role_name
#   handler = var.lambda_handler_ad_trigger
#   timeout = var.lambda_timeout
#   memory_size = var.lambda_memory_size
#   runtime = "python3.8"
#   vpc_config {
#     security_group_ids = [var.sg_default]
#     subnet_ids = var.subnets
#   }
#   source_code_hash = filebase64sha256("${var.lambda_payload_path}")
#   environment {
#     variables = {
#       ADMIN_GROUP = var.admin_group
#     }
#   }
# }
# resource "aws_lambda_permission" "dpcm_cognito_lambda_permission_ad_trigger" {
#   statement_id = "execute_lambda_function"
#   action = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.dpcm_cognito_trigger_ad.function_name
#   principal = "cognito-idp.amazonaws.com"
#   source_arn = aws_cognito_user_pool.dpcm_pool.arn
# }
 
 # resource "aws_lambda_function" "fact_cognito_pre_auth" {
 #   filename = var.lambda_payload_path
 #   function_name = var.lambda_function_name_cognito_pre_auth
 #   role = var.lambda_role_name
 #   handler = var.lambda_handler_pre_auth_trigger
 #   timeout = var.lambda_timeout
 #   memory_size = var.lambda_memory_size
 #   runtime = "python3.8"
 #   vpc_config {
 #     security_group_ids = [var.sg_app,var.sg_default]
 #     subnet_ids = var.subnets
 #   }
 #   source_code_hash = filebase64sha256("${var.lambda_payload_path}")
 #   environment {
 #     variables = {
 #       ADMIN_GROUP = var.admin_group
 #       USER_GROUP = var.user_group
 #     }
 #   }
 # }
 # resource "aws_lambda_permission" "fact_cognito_lambda_permission_pre_auth_trigger" {
 #   statement_id = "execute_lambda_function"
 #   action = "lambda:InvokeFunction"
 #   function_name = aws_lambda_function.fact_cognito_pre_auth.function_name
 #   principal = "cognito-idp.amazonaws.com"
 #   source_arn = aws_cognito_user_pool.dpcm_pool.arn
 # }
# 