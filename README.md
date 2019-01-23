Terria Map
==========

![Terria logo](terria-logo.png "Terria logo")

[![Greenkeeper badge](https://badges.greenkeeper.io/TerriaJS/TerriaMap.svg)](https://greenkeeper.io/)

This is a complete website built using the TerriaJS library. See the [TerriaJS README](https://github.com/TerriaJS/TerriaJS) for information about TerriaJS, and getting started using this repository.

# Experiment with Magda
## Goals
* Retrieve terria map config data from magda-gateway.
* Retrieve terria map initial catalog data from magda-gateway.

## Local development instructions
### Start Magda
Only combined-db-0, registry-api and magda-gateway are needed.
* Check out magda branch "withTerria" from repository git@github.com:magda-io/magda.git.
* Run magda database "combined-db-0" and make sure it is accessible at localhost:5432.
* Start registry-api and make sure it is accessible at http://localhost:6101.
* In magda-gateway/src/defaultConfig.ts, set "proxyRoutes.registry.auth" to false temporarily. 
* Start magda-gateway and make sure it is accessible at http://localhost:6100.
  ```
     cd magda-gateway
     yarn build
     yarn dev
  ```
### Create terria tenant aspects
Post the following json data to http://localhost:6100/api/v0/registry/aspects (For example, use Postman)
* magda/magda-registry-aspects/terria-map-config.schema.json
* magda/magda-registry-aspects/terria-catalog.schema.json

### Create records for the default terria tenant and the demo terria tenant
Post the following json data to http://localhost:6100/api/v0/registry/records
* magda/magda-registry-api/src/main/resources/terria-tenant-default.json
* magda/magda-registry-api/src/main/resources/terria-tenant-demo.json
The registry now has two terria tenants, identified by "terria-tenant-default" and "terria-tenant-demo".

### Start TerriaMap
Once the terria related records are in the database, we can start TerriaMap server.
  ```
    yarn gulp
    yarn start
  ```
### Testing
#### For a default tenant
* Open a browser, navigate to http://localhost:3001 or http://localhost:3001?tenantId=terria-tenant-default.
* Click on "Add data", the "Example datasets" should contain "Data.gov.au" only.

#### For a demo tenant
* Open a browser, navigate to http://localhost:3001?tenantId=terria-tenant-demo.
* Click on "Add data", the "Example datasets" should contain "Small glTF 3D Models" only.
