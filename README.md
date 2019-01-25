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
### Build Magda-backed TerriaMap

#### Define environment variables
By default, a TerriaMap server is configured using file in ./wwwroot/config.json and serves contents in that directory wwwroot.
To configure a TerriaMap with Magda as a backend, please create a .env file in the root directory, adding the following line in the file:
```
MAGDA=true
```

#### Build TerriaMap
Run command:
```
yarn gulp
```

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
     yarn dev-for-terria
  ```
### Create terria tenant aspects
Post the following json data to http://localhost:6100/api/v0/registry/aspects (For example, use Postman)
* magda-registry/aspects/terria-config.schema.json
* magda-registry/aspects/terria-catalog.schema.json

### Create sample records for domains "demo1.terria.magda" and "demo2.terria.magda"
Post the following json data to http://localhost:6100/api/v0/registry/records
* magda-registry/sample-records/demo1.json
* magda-registry/sample-records/demo2.json

The registry now has two terria tenants, identified by "demo1.terria.magda" and "demo2.terria.magda", respectively.

### Start TerriaMap
Once the terria related records are in the database, we can start TerriaMap server.
  ```
    yarn start
  ```

### Resolve domain names for local development
For Windows, add the following two lines to file "C:\Windows\System32\drivers\etc\hosts". 

(You should remove
them from the file should you want to navigate to these two domains in the real world.)
```
    127.0.0.1 demo1.terria.magda
    127.0.0.1 demo2.terria.magda
```
### Testing
#### demo1
* Open a browser, navigate to http://demo1.terria.magda:3001.
* Click on "Add data", the "Example datasets" should contain "Data.gov.au" only.

#### demo2
* Open a browser, navigate to http://demo2.terria.magda:3001.
* Click on "Add data", the "Example datasets" should contain "Small glTF 3D Models" only.
* To replace the datasets, use PATCH method to send data in "magda-registry/sample-records/demo2.json" to the magda gateway at http://localhost:6100/api/v0/registry/records/demo2.terria.magda
* Refresh the browser, the "Example datasets" should be changed (a lot). 
