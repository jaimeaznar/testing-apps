#!/usr/bin/env bash

# assume_aws_role <role_arn>
assume_aws_role () {
    local role_arn=${1}
    local sts_output

    sts_output=$(aws sts assume-role --role-arn "${role_arn}" --role-session-name gitlab-configuration)

    # shellcheck disable=SC2155
    export AWS_ACCESS_KEY_ID=$(echo "$sts_output" | jq -r '.Credentials.AccessKeyId')
    # shellcheck disable=SC2155
    export AWS_SECRET_ACCESS_KEY=$(echo "$sts_output" | jq -r '.Credentials.SecretAccessKey')
    # shellcheck disable=SC2155
    export AWS_SESSION_TOKEN=$(echo "$sts_output" | jq -r '.Credentials.SessionToken')
    # shellcheck disable=SC2155
    export AWS_EXPIRATION=$(echo "$sts_output" | jq -r '.Credentials.Expiration')
}

# check_terragrunt_project_fmt [project_directory = .]
#
# Performs code style checks on Terragrunt and Terraform files of the given project directory
# Returns 0 if no error, 1 if some errors were found
check_terragrunt_project_fmt () {
    local project_directory=${1:=.}
    local terraform_directories=( "modules" "shared-modules" )
    local terraform_directory
    local res

    # Terragrunt part
    echo "** Checking terragrunt.hcl files format recursively..."
    (cd "${project_directory}" && terragrunt hclfmt)
    res=$?
    # shellcheck disable=SC2015
    [[ $res == 0 ]] && echo_green " -> OK" || echo_red " -> Some errors were found!"

    # Terraform part
    for terraform_directory in "${terraform_directories[@]}"; do
        [[ ! -d "${project_directory}/${terraform_directory}" ]] && continue # skip if directory does not exist

        check_terraform_fmt_recursively "${project_directory}/${terraform_directory}"
        # shellcheck disable=SC2181
        [[ $res == 0 && $? == 0 ]] && res=0 || res=1
    done

    return $res
}

# check_terraform_fmt_recursively <directory>
#
# Performs a recursive "terraform fmt" in the subdirectories of the given directory
# Returns 0 if no error, 1 if some errors were found
check_terraform_fmt_recursively () {
    local directory=${1}
    local res

    echo "** Checking Terraform files format recursively in ${directory}..."
    find "${directory}" ! -path "${directory}" -type d -print0 | xargs -0 -n1 -I{} sh -c 'echo "Switching to {}..." && cd "{}" && terraform fmt'
    res=$?
    # shellcheck disable=SC2015
    [[ $res == 0 ]] && echo_green " -> OK" || echo_red " -> Some errors were found!"

    return $res
}

# exec_tflint_on_terragrunt_project [project_directory = .]
#
# Executes "tflint --module" on all Terraform files of the project
# Don't forget to set the correct AWS environment variables because of the deep mode
# Locally you should typically set AWS_PROFILE and AWS_REGION
#
# Returns 0 if no error, 1 if some errors were found
exec_tflint_on_terragrunt_project () {
    local project_directory=${1:=.}
    local terraform_directories=( "modules" "shared-modules" )
    local res=0

    for terraform_directory in "${terraform_directories[@]}"; do
        [[ ! -d "${project_directory}/${terraform_directory}" ]] && continue # skip if directory does not exist

        exec_tflint_recursively "${project_directory}/${terraform_directory}"
        # shellcheck disable=SC2181
        [[ $res == 0 && $? == 0 ]] && res=0 || res=1
    done

    return $res
}

# exec_tflint_recursively <directory>
#
# Performs a recursive "tflint --module" in the subdirectories of the given directory
# Returns 0 if no error, 1 if some errors were found
exec_tflint_recursively () {
    local directory=${1}
    local res
    echo "** Executing tflint recursively in ${directory}..."
    find "${directory}" ! -path "${directory}" -type d -print0 | xargs -0 -n1 -I{} sh -c 'echo "Switching to {}..." && cd "{}" && tflint --module'
    res=$?
    # shellcheck disable=SC2015
    [[ $res == 0 ]] && echo_green " -> OK" || echo_red " -> Some errors were found!"

    return $res
}

# terragrunt_plan_all_with_result
#
# Performs a "terragrunt plan-all" with the "--detailed-exitcode" option to detect changes:
#  - exit code 0 if no changes
#  - exit code 2 if there are changes
#  - exit code 1 if there was an error
# (https://www.terraform.io/docs/commands/plan.html#detailed-exitcode)
# The exit code is saved in plan_result.sh, in order to be read later by terragrunt_plan_changes_indicator()
#
# However there is a bug in Terragrunt v0.23 that outputs this as an error: https://github.com/gruntwork-io/terragrunt/issues/1166
# It works correctly but this can be confusing when reading the logs
#
# Returns 0 if no error, 1 if some errors were found
terragrunt_plan_all_with_result () {
    local exit_code

    set +e
    terragrunt plan-all --terragrunt-non-interactive --detailed-exitcode
    exit_code=$?
    set -e

    echo "export PLAN_EXIT_CODE=${exit_code}" > plan_result.sh

    if [[ ${exit_code} -ne 0 ]] && [[ ${exit_code} -ne 2 ]]; then
        return ${exit_code}
    fi
}

# terragrunt_plan_changes_indicator
#
# Reads plan_result.sh, generated from terragrunt_plan_all_with_result()
# and displays if there is changes to apply or not
# Return codes:
#  - 1: error
#  - 0: no changes (appears as a green tick in GitLab interface)
#  - 2: there are some changes to apply (appears as a yellow exclamation mark in GitLab interface)
terragrunt_plan_changes_indicator () {
    # shellcheck disable=SC1091
    source plan_result.sh

    if [[ -z "${PLAN_EXIT_CODE}" ]]; then
      echo_red " -> Something went wrong in the pipeline"
      exit 1
    elif [[ ${PLAN_EXIT_CODE} -eq 2 ]]; then
      echo_yellow " -> There are some changes to apply!"
      echo_yellow " -> Please review the 'terraform plan' job to see the details..."
      exit 2
    elif [[ ${PLAN_EXIT_CODE} -eq 0 ]]; then
      echo_green " -> No changes were found during terraform plan"
      exit 0
    else
      echo_red " -> There was an error during terraform plan"
      exit 1
    fi
}

# Helpers
echo_red () {
    echo -e "\e[91m" "$@" "\e[0m"
}
echo_yellow () {
    echo -e "\e[43m" "$@" "\e[0m"
}
echo_green () {
    echo -e "\e[92m" "$@" "\e[0m"
}
