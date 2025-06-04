#!/usr/bin/env bash

# semver_lte <v1> <v2>
#
# Tests if v1 <= v2
# Source: https://stackoverflow.com/a/4024263
semver_lte () {
    [ "$1" = "`echo -e "$1\n$2" | sort -V | head -n1`" ]
}

# semver_lt <v1> <v2>
#
# Tests if v1 < v2
# Source: https://stackoverflow.com/a/4024263
semver_lt () {
    [ "$1" = "$2" ] && return 1 || semver_lte $1 $2
}
