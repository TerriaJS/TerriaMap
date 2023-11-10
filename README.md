# Terria Map

[![Build Status](https://github.com/TerriaJS/TerriaMap/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/TerriaJS/TerriaMap/actions/workflows/ci.yml) [![Docs](https://img.shields.io/badge/docs-online-blue.svg)](https://docs.terria.io/)

![Terria logo](terria-logo.png "Terria logo")

This is a complete website built using the TerriaJS library. See the [TerriaJS README](https://github.com/TerriaJS/TerriaJS) for information about TerriaJS, and getting started using this repository.

For instructions on how to deploy your map, see [the documentation here](doc/deploying/deploying-to-aws.md).

---

### We just reformatted our codebase with [Prettier](https://prettier.io/) (2022-08-29)

This may cause large merge conflicts when you merge `main` into your fork. See https://github.com/TerriaJS/terriajs/discussions/6517 for instructions on how to merge this formatting change.

### We have released TerriaJS v8 (2021-08-13)

What this means:

- [Our new main branch of TerriaMap](https://github.com/TerriaJS/TerriaMap/tree/main) now uses v8+ of TerriaJS
- [The terriajs7 branch of TerriaMap](https://github.com/TerriaJS/TerriaMap/tree/terriajs7) will use v7 TerriaJS, but will not receive further updates
- We have a [migration guide](https://docs.terria.io/guide/contributing/migration-guide/) available for users of TerriaJS v7 to help them upgrade their applications to TerriaJS v8
- Please chat to us and the community in our [GitHub discussions forum](https://github.com/TerriaJS/terriajs/discussions)

## Installation Instructions (Updated 2023)

1. Git clone
2. NPM install
3. In a new window run gulp:watch
4. Run npm run start
5. Give it a few minutes and the app should be running on http://localhost:3001/

## Creating a new patch file

1. run npm run patch
2. Check that your new changes were created inside the patch file
3. Push up latest patch file and alert team that there is a new patch
