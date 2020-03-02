# 0. Record architecture decisions

Date: 2020-03-02

## Status

Proposal

## Context

I'm unsure about this one.

Our lockfile situation is a little messy.

Recently our TerriaMap CI builds have been failing, probably due to a recent change via travis using `yarn --frozen-lockfile` & failing when yarn's equivalent package-lock.json (yarn.lock) is out of sync (https://github.com/travis-ci/travis-build/pull/1858).

Removing yarn.lock fixes CI as travis currently thinks it's a yarn-developed project.

I don't fully understand why we have yarn.lock commited in the first place, however we DO recommend & use yarn when developing using the workspace feature.

Other things to note for this proposal:
- greenkeeper is set up to update package-lock.json and not yarn.lock
- we always cite npm in docs
- i've always used npm when doing release builds
- our other projects using things like github actions (NSW DT) use `npm ci` and not yarn

## Decision

1. Don't have yarn.lock in source(?)
2. Keep both, but force travis to use npm, npm ci, package-lock.json etc(?), at the cost of having to keep yarn.lock up to date as well.

## Consequences
We still use two different tools for generating lock files, npm for releasing, yarn for developing. This could lead to instances where there are 'non-reproducible dev builds' (but always-reproducible production builds), even though a given `package.json` should resolve to roughly the same versions with the two tools.