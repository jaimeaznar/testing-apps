#!/usr/bin/env bash

# print_github_latest_release_tag_name <owner> <repo>
#
# Prints the latested release tag name of the given repository
# Returns 1 if there is an error
print_github_latest_release_tag_name () {
    local owner="${1}"
    local repo="${2}"
    local res tag_name

    res=$(_github_get_request "/repos/${owner}/${repo}/releases/latest")
    if [[ $? != 0 ]]; then
        return 1
    fi

    tag_name=$(echo "$res" | tr '\r\n' ' ' | jq -r .tag_name)
    if [[ $? != 0 || ${tag_name} == "null" ]]; then
        echo_err "Impossible to parse Github API response correctly:"
        echo_err "${res}"
        return 1
    fi

    echo "${tag_name}"
}

# guess_version_from_tag_name <release tag name>
#
# Just basically remove the "v" from the given tag name
guess_version_from_tag_name () {
    local tag_name="${1}"
    echo "${tag_name//v}"
}

# download_and_extract_github_release <owner> <repo> <release tag name>
#
# Downloads a release from the given repository thanks to its tag name
# and extract it INSIDE THE CURRENT DIRECTORY
# Returns 1 if there is an error
download_and_extract_github_release () {
    local owner="${1}"
    local repo="${2}"
    local tag_name="${3}"
    local res tarball_url

    res=$(_github_get_request "/repos/${owner}/${repo}/releases/tags/${tag_name}")
    if [[ $? != 0 ]]; then
        return 1
    fi

    tarball_url=$(echo "$res" | tr '\r\n' ' ' | jq -r .tarball_url)
    if [[ $? != 0 || ${tarball_url} == "null" ]]; then
        echo_err "Impossible to parse Github API response correctly:"
        echo_err "${res}"
        return 1
    fi

    curl -sL "${tarball_url}" | tar -xz --strip 1
}

# download_and_extract_github_branch <owner> <repo> <branch-name>
#
# Downloads a branch from the given repository thanks to its branch name
# and extract it INSIDE THE CURRENT DIRECTORY
# Returns 1 if there is an error
download_and_extract_github_branch () {
    local owner="${1}"
    local repo="${2}"
    local branch_name="${3}"

    res=$(curl -IL --show-error --fail "https://api.github.com/repos/${owner}/${repo}/tarball/${branch_name}")
    if [[ $? != 0 ]]; then
        echo_err "Impossible to download ${branch_name} archive from Github:"
        echo_err "${res}"
        return 1
    fi

    curl -sL "https://api.github.com/repos/${owner}/${repo}/tarball/${branch_name}" | tar -xz --strip 1
}

# Helpers
_github_get_request () {
    local uri="${1}"
    local res

    res=$(curl -sL "https://api.github.com${uri}")
    if [[ $? != 0 ]]; then
        echo_err "Github API error:"
        echo_err "${res}"
        return 1
    fi

    echo "${res}"
}

echo_err () {
    echo -e "\e[91m" "$@" "\e[0m" 1>&2
}
