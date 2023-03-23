# Terria Map

[![Build Status](https://github.com/TerriaJS/TerriaMap/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/TerriaJS/TerriaMap/actions/workflows/ci.yml) [![Docs](https://img.shields.io/badge/docs-online-blue.svg)](https://docs.terria.io/)

![Terria logo](terria-logo.png "Terria logo")

This is a complete website built using the TerriaJS library. See the [TerriaJS README](https://github.com/TerriaJS/TerriaJS) for information about TerriaJS, and getting started using this repository.

For instructions on how to deploy your map, see [the documentation here](doc/deploying/deploying-to-aws.md).

---

### PM2 no longer supported (2023-03-21)

We've removed pm2 from our dependencies and no longer ship configuration for running terriajs-server with pm2.

`npm start` now runs in forground because it no longer uses pm2. A new task `gulp dev` has been introduced to make development easier. It runs terriajs-server and starts `gulp watch` - which watches for changes and incrementally builds. See https://github.com/TerriaJS/terriajs/discussions/6731 for more information on why and what to do.

### We just reformatted our codebase with [Prettier](https://prettier.io/) (2022-08-29)

This may cause large merge conflicts when you merge `main` into your fork. See https://github.com/TerriaJS/terriajs/discussions/6517 for instructions on how to merge this formatting change.

### We have released TerriaJS v8 (2021-08-13)

What this means:

- [Our new main branch of TerriaMap](https://github.com/TerriaJS/TerriaMap/tree/main) now uses v8+ of TerriaJS
- [The terriajs7 branch of TerriaMap](https://github.com/TerriaJS/TerriaMap/tree/terriajs7) will use v7 TerriaJS, but will not receive further updates
- We have a [migration guide](https://docs.terria.io/guide/contributing/migration-guide/) available for users of TerriaJS v7 to help them upgrade their applications to TerriaJS v8
- Please chat to us and the community in our [GitHub discussions forum](https://github.com/TerriaJS/terriajs/discussions)
