# Konviw mirror

This repository follows the [IADC Release Strategy implementation guidelines](https://iadc.atlassian.net/wiki/spaces/IADC/pages/429326377/Implementation+guidelines+of+the+IADC+Release+Strategy).

## Why a mirror?

Konviw, previously known as "Confluence Public Viewer" was open sourced in March 2021: https://github.com/Sanofi-IADC/konviw

We could have deployed it in IADC directly from its public [Docker Hub image](https://hub.docker.com/r/sanofiiadc/konviw).
However, we decided to build our own image from the sources instead for these reasons:

- We want to perform [Checkmarx SAST](https://iadc.atlassian.net/wiki/spaces/IADC/pages/244285928/ADR-019+-+Application+code+automated+security+testing) on the source code before the image is built
  - But we can't do it inside the open source CI/CD because this is an internal service

This is why this repository only contains scripts that performs the mirroring from Github and the build.
All the development of Konviw happens on Github.

## How does it work?

A Gitlab [scheduled pipeline](https://docs.gitlab.com/ee/ci/pipelines/schedules.html) is executed every working day at 8am, 11am and 4pm to detect if a new Whispr release was published on Github. To do so, it performs the following steps:

1. Get the latest release version on Github
2. Get the current version deployed on INTEGRATION with [Sanofi Release Manager](https://emea-aws-gitlab.sanofi.com:3001/factory4/digital-foundation/sanofi-release-manager) from the [environments repository](https://emea-aws-gitlab.sanofi.com:3001/factory4/digital-foundation/iadc-portal/iadc-portal-environments)
3. Compare the two: if there is a difference, a new version is available!

Then, when a new version is detected, it triggers a new pipeline which performs the following steps:

1. Download the latest release tarball on Github
2. Execute Checkmarx and other quality steps on the source code -> Not yet implemented - To be done
3. Build the Docker image and push it to Artifactory
4. Trigger the pipeline on the environments repository to deploy this new version to INTEGRATION (classic IADC Release Strategy)
5. [WIP] Open automatically a new Merge Request to merge `master` into `env/uat` with a predefined list of reviewers, so that they are notified of the new version

## FAQ

**Why not using the Gitlab's built-in [mirroring feature](https://docs.gitlab.com/ee/user/project/repository/repository_mirroring.html)?**

Because this feature is [disabled for the moment](https://www.yammer.com/sanofi.com/threads/735847634493440) for our Gitlab instance.
