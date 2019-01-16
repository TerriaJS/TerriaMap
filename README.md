Terria Map
==========

![Terria logo](terria-logo.png "Terria logo")

[![Greenkeeper badge](https://badges.greenkeeper.io/TerriaJS/TerriaMap.svg)](https://greenkeeper.io/)

This is a complete website built using the TerriaJS library. See the [TerriaJS README](https://github.com/TerriaJS/TerriaJS) for information about TerriaJS, and getting started using this repository.

# Experiment
## Goals
* Retrieve terria config file from a different web server.
* Retrieve terria initial catalog files from a different web server.

## Approach
* Copy all files under directory "files-to-be-copied-to-a-server" to a web server. Currently I enabled Windows IIS and save those files in C:\inetpub\wwwroot. For example, file terria-config.json can be retrieved via http://localhost/terria-config.json.

See https://docs.microsoft.com/en-us/previous-versions/ms181052(v=vs.80)

* With vscode, run DEBUG "Lauch Server". (Other method of starting server may encounter CORS error, which is yet to be investigated.)
* With a browser, go to http://localhost:3001 to view the terria map.