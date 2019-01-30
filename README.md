Terria Map
==========

![Terria logo](terria-logo.png "Terria logo")

[![Greenkeeper badge](https://badges.greenkeeper.io/TerriaJS/TerriaMap.svg)](https://greenkeeper.io/)

This is a complete website built using the TerriaJS library. See the [TerriaJS README](https://github.com/TerriaJS/TerriaJS) for information about TerriaJS, and getting started using this repository.

# Experiment with Magda
## Goals
* A single Terria Map server serves many different Terria Map websites. Each website will have its own domain name.
* The Terria Map server dynamically configures each website with customised initial catalogs.
* The initial catalogs can be dynamically updated via Magda registry api.

## Design
* The Magda gateway will proxy the Terria Map server.
* Terria Map website domain names (e.g. demo1.terria.magda and demo2.terria.magda) are different from Magda gateway and
  Terria Map servers (e.g. localhost).
* A customised website configuration data can be retrieved or updated via Magda gateway (NOT via the Terria Map server).
* All Terria Map website domain names will be resolved to the Magda gateway. That is, the Terria Map server is behind
  the Magda gateway.

## Local development instructions
### Build Magda-backed TerriaMap
#### Define environment variables
By default, a TerriaMap server is built by using config file [wwwroot/config.json](wwwroot/config) and serves contents in directory wwwroot. 
To build a TerriaMap using Magda as a backend, please create file ".env" in the root directory, adding the following line in the file:
```
MAGDA=true
```
You may also define more enviroment variables in ".env", e.g., adding a second line if you wish:
```
NODE_ENV=development
```
Please do not commit the ".env" file.

#### Build TerriaMap
Run command:
```
yarn gulp
```

### Start Magda
Only combined-db-0, registry-api and magda-gateway are needed.
* Check out branch [withTerria](https://github.com/magda-io/magda/tree/withTerria) from repository [magda](https://github.com/magda-io/magda.git). 
  The only difference between this branch and the master is that it provides
a "dev-for-terria" script for the experiment.
* Run magda database "combined-db-0" and make sure it is accessible at localhost:5432.
* Start registry-api and make sure it is accessible at http://localhost:6101.
* Build and start magda-gateway. The  Magda gateway default content security policy (csp) allows for same origin script
  loading only and refuses inline script execution, which may cause problems for some browsers such as Chrome. To
  overcome the problems, the gateway's default csp will be customised by file 
  [terria-map-csp.json](magda/gateway/config/terria-map-csp.json). Please copy that json file to the root directory of
  magda-gateway before starting the gateway server. The gateway must be restarted whenever this json file is changed.

  ```
     cd magda-gateway
     yarn build
     yarn dev-for-terria
  ```
  Make sure it is accessible at http://localhost:6100.

### Create terria tenant aspects
Post the following json data to http://localhost:6100/api/v0/registry/aspects (For example, use Postman)
* [magda/registry/aspects/terria-config.schema.json](magda/registry/aspects/terria-config.schema.json)
* [magda/registry/aspects/terria-catalog.schema.json](magda/registry/aspects/terria-catalog.schema.json)

### Create sample records for domains "demo1.terria.magda" and "demo2.terria.magda"
Post the following json data to http://localhost:6100/api/v0/registry/records
* [magda/registry/sample-records/demo1.json](magda/registry/sample-records/demo1.json)
* [magda/registry/sample-records/demo2.json](magda/registry/sample-records/demo2.json)

The registry now has two terria tenants, identified by "demo1.terria.magda" and "demo2.terria.magda", respectively.

### Start TerriaMap
Once the terria related records are in the database, we can start TerriaMap server.
  ```
    yarn start
  ```

### Resolve domain names for local development
This is to simulate two Terria Map website domain names, demo1.terria.magda and demo2.terria.magda, being resolved to
the Magada gateway running on localhost (127.0.0.1). For Windows platform, add the following two lines to file 
"C:\Windows\System32\drivers\etc\hosts". 

(You should remove them from the file should you want to navigate to these two domains in the real world.)
```
    127.0.0.1 demo1.terria.magda
    127.0.0.1 demo2.terria.magda
```
### Testing
#### Visit website demo1.terria.magda
* Open a browser, navigate to http://demo1.terria.magda:6100.
* Click on "Add data", the "Example datasets" should contain "Data.gov.au" only.

#### Visit website demo2.terria.magda
* Open a browser, navigate to http://demo2.terria.magda:6100.
* Click on "Add data", the "Example datasets" should contain "Small glTF 3D Models" only.

#### Change datasets for website demo1.terria.magda
* To replace its datasets, use PATCH method to send data in [magda-registry/sample-records/replace-first-catalog.json](magda-registry/sample-records/replace-first-catalog.json) to the magda gateway at http://localhost:6100/api/v0/registry/records/demo1.terria.magda
* Refresh the browser at http://demo1.terria.magda:6100, the "Example datasets" should be changed (a lot). 
