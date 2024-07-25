# 2. Docker multi-architecture build using create-docker-context

Date: 2024-07-18

## Status

Proposed

## Context

I (crispy) consider a multi-stage dockerfile to be the gold standard of
reproducible, mutli-architecture builds. Something like the following:

- Build container copies workspace, installs development dependencies and builds
  the app.
- Production container copies build artifacts and installs only production
  dependencies.

is ideal. This ensures only production dependencies are present, and you can run
this process on every architecture to create a multi-arch docker image. Binaries
downloaded during dependency installation will fetch the correct architecture
binary as depencies are installed separately on each architecture. But
installing dependencies and building JS is extremely slow on emulated
architectures, such as docker buildx on GitHub Actions (this can take 2.5 hours
to build the image).

If instead we can (on the build machine/VM):

1. install all dependencies
2. build the app
3. copy build artifacts and only production dependencies to the multi-arch
   docker image

then **as long as production dependencies are portable**, we have a working
multi-arch docker image with very little computation being run on emulated
architectures. The `create-docker-context.js` script allows us to do this,
copying build artifacts and only production dependencies to an intermediate
"context" folder which is then used to create the image.

Currently none of our production dependencies install non-portable binaries.

## Decision

While all production dependencies remain portable, we will build
multi-architecture docker images by building TerriaMap on the VM and copying
only production-necessary files and dependencies to the final docker image.

## Consequences

- We will replace current GitHub Actions release process with one using
  `create-docker-context.js`.
- Our GitHub Actions TerriaMap release time will reduce from 2.5 hours to less
  than 10 minutes.
- If in future TerriaMap uses a binary installed by side effect during JS
  dependency installation and this binary cannot be run on an architecture for
  which an image is created, that image will fail when run on that architecture.
