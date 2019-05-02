Terria Map
==========

![Terria logo](terria-logo.png "Terria logo")

[![Greenkeeper badge](https://badges.greenkeeper.io/TerriaJS/TerriaMap.svg)](https://greenkeeper.io/)

This is a complete website built using the TerriaJS library. See the [TerriaJS README](https://github.com/TerriaJS/TerriaJS) for information about TerriaJS, and getting started using this repository.

# Experiment with Magda
## Goals
* A single Terria Map server serves many different Terria Map websites. Each website will have its own domain name.
* The Terria Map server dynamically configures each website with customised initial catalogs.
* The initial catalogs can be dynamically updated by the corresponding website admin.
* Other contents are also served dynamically based on website domain names.

## Design
* The Magda gateway will proxy the Terria Map server.
* A customised website configuration data can be created, deleted, retrieved, patched or updated by the website's admin.
* All Terria Map website domain names will resolve to the Magda gateway external IP address.
* The Terria Map server is behind the Magda gateway.
* Tenant management (create/enable/disable) is via Magda admin portal that also resolves to the Magda gateway external IP address.

## Demo
Two demo websites might be found at 
1. https://web1-withterria.dev.magda.io
2. https://web2-withterria.dev.magda.io

Each website will have its own datasets and "look-and-feel".

## Next step proposal
### Tenant management UI
This is for the magda platform admin to manage all tenants, e.g., via URL https://admin-withterria.dev.magda.io/terriaAdmin.

### Tenant website management UI
This is for each tenant website's admin to manage their own website. For example, The admin of website https://web1-withterria.dev.magda.io 
can manage the website's datasets via URL https://web1-withterria.dev.magda.io/terriaAdmin.

## Development instructions
### Magda

#### Code
The development of Magda with multi-tenant support is in the branch of [withTerria](https://github.com/magda-io/magda/tree/withTerria) in
the repository of [magda](https://github.com/magda-io/magda.git).

#### Deploy Magda to Google Cloud
If it is the first time using the Magda gitlab infrastructure to deploy magda with multi-tenant support, follow the steps below.
1. Check out the branch [withTerria](https://github.com/magda-io/magda/tree/withTerria).
2. Edit at least one file, e.g. `README.md`, then commit and push the change, which will trigger gitlab pipeline jobs. 
3. After all the dockerize jobs are completed, the magda images will have tags of `withterria` in `registry.gitlab.com/magda-data/magda/data61`.
   Manually trigger the job `(No Data) Run As Preview`, which will create a `withterria` namespace, all neccessary secrets and deploy the magda.
4. The gitlab job deploys magda with multi-tenant mode disabled by default. After the deployment, if you browse https://withterria.dev.magda.io, a magda 
   website will appear (without any datasets). We need to redeploy it in multi-tenant mode and specify addtional arguments.
   Copy [preview-terria-map.yml](#magda/deploy/preview-terria-map.yml) to `deploy/helm/preview-terria-map.yml` in the magda project then `cd` to the magda project root directory and run the following commands:
  ```
    kubectl.exe config use-context gke_terriajs_asia-east1-a_dev-new

    helm upgrade withterria deploy/helm/magda --install --recreate-pods --namespace withterria -f deploy/helm/preview-terria-map.yml --set global.image.repository=registry.gitlab.com/magda-data/magda/data61,global.image.tag=withterria,ingress.hostname=admin-withterria.dev.magda.io,combined-db.waleBackup.method=NONE,elasticsearch.useGcsSnapshots=false,global.externalUrl=https://admin-withterria.dev.magda.io,global.namespace=withterria
  ```

### Resolve domain names
To demonstrate the multi-tenant features, We will use the following URLs.
* The URL https://admin-withterria.dev.magda.io, for magda management.
* The URL https://web1-withterria.dev.magda.io, for the first tenant website.
* The URL https://web2-withterria.dev.magda.io, for the second tenant website.

To resolve the domain names in the above URLs, we need to edit ingress manually after the magda deployment. Run
```
  kubectl --context=gke_terriajs_asia-east1-a_dev-new --namespace=withterria edit ingress ingress
```

A text editor will pop up with content similar to the following
```
...
spec:
  rules:
  - host: admin-withterria.dev.magda.io
    http:
      paths:
      - backend:
          serviceName: gateway
          servicePort: 80
        path: /
  tls:
  - hosts:
    - admin-withterria.dev.magda.io
...
```

We need to modifiy it by adding more hosts in the `rules` section, such as:
```
  - host: admin-withterria.dev.magda.io
    http:
      paths:
      - backend:
          serviceName: gateway
          servicePort: 80
        path: /
  - host: web1-withterria.dev.magda.io
    http:
      paths:
      - backend:
          serviceName: gateway
          servicePort: 80
        path: /
  - host: web2-withterria.dev.magda.io
    http:
      paths:
      - backend:
          serviceName: gateway
          servicePort: 80
        path: /
```
The final text looks like:
```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/client-body-buffer-size: 10M
    nginx.ingress.kubernetes.io/proxy-body-size: 10M
  creationTimestamp: 2019-03-24T23:24:58Z
  generation: 3
  name: ingress
  namespace: withterria
  resourceVersion: "141147691"
  selfLink: /apis/extensions/v1beta1/namespaces/withterria/ingresses/ingress
  uid: 0a203e48-4e8c-11e9-828d-42010af0024b
spec:
  rules:
  - host: admin-withterria.dev.magda.io
    http:
      paths:
      - backend:
          serviceName: gateway
          servicePort: 80
        path: /
  - host: web1-withterria.dev.magda.io
    http:
      paths:
      - backend:
          serviceName: gateway
          servicePort: 80
        path: /
  - host: web2-withterria.dev.magda.io
    http:
      paths:
      - backend:
          serviceName: gateway
          servicePort: 80
        path: /
  tls:
  - hosts:
    - admin-withterria.dev.magda.io
status:
  loadBalancer:
    ingress:
    - ip: 35.201.203.227
```
Save the final text and close the editor. Now all the above three URLs will resolve to the gateway external IP address.

### Magda admin tasks
#### Login as admin user
Before an admin UI becomes available, we have to manually create a user account then login onto magda. 
Magda uses third-party authentication service, such as `data.gov.au`, facebook and google. 

##### Create your account
Take `data.gov.au` as an example. Navigate to https://data.gov.au/data/user/register and set your `username` and `password`.

##### Login to magda
Open a Chrome browser and navigate to https://admin-withterria.dev.magda.io/auth/login/ckan. A very primative UI will appear. 
Fill in your `data.gov.au` `username` and `password` then submit. If successful, "You are logged in. View your profile." will be displayed. 
Click on `profile` link, you will see that `isAdmin` value is `false`. Use a database tool to set it to `true` otherwise you will not have 
write access to the magda resources.

(Note: A Chrome browser is recommended as the Postman tool to be used later needs to intercept the authentication cookie from it.)

The magda admin needs to add some tenants in the registry database. Before an [admin portal UI](#Tenant-management-UI) becomes available, 
we have to use other tools such as Postman to do the jobs. 

#### Add tenants
Post the following json data to https://admin-withterria.dev.magda.io/api/v0/registry-auth/tenants.
* [magda/registry/tenants/tenant1.json](magda/registry/tenants/tenant1.json)
* [magda/registry/tenants/tenant2.json](magda/registry/tenants/tenant2.json)

### Configure website https://web1-withterria.dev.magda.io
Tenant website admins are responsible to configure their own terria websites. Before the [website admin portal UI](#Tenant-website-management-UI)
becomes available, we have to use other tools such as Postman to do the jobs. The admin of website https://web1-withterria.dev.magda.io can configure
the website according to the following instructions.

#### Login to magda
Open a Chrome browser and navigate to https://web1-withterria.dev.magda.io/auth/login/ckan to login. Try again if failure.

#### Add terria aspects
Use Postman to post the following json data to https://web1-withterria.dev.magda.io/api/v0/registry-auth/aspects.
Must ensure `{"tenantId": "1"}` in both files.
* [magda/registry/aspects/terria-config.schema.json](magda/registry/aspects/terria-config.schema.json)
* [magda/registry/aspects/terria-catalog.schema.json](magda/registry/aspects/terria-catalog.schema.json)

#### Add a terria configuration record
Must ensure `{"tenantId": "1"}` in the file.
Post the json data in [magda/registry/sample-records/demo1.json](magda/registry/sample-records/demo1.json) to https://web1-withterria.dev.magda.io/api/v0/registry-auth/records

### Configure website https://web2-withterria.dev.magda.io
#### Login to magda
Open a Chrome browser and navigate to https://web2-withterria.dev.magda.io/auth/login/ckan to login.

#### Add terria aspects
Must ensure `{"tenantId": "2"}` in both files.
Use Postman to post the following json data to https://web2-withterria.dev.magda.io/api/v0/registry-auth/aspects.
* [magda/registry/aspects/terria-config.schema.json](magda/registry/aspects/terria-config.schema.json)
* [magda/registry/aspects/terria-catalog.schema.json](magda/registry/aspects/terria-catalog.schema.json)

#### Add a terria configuration record
Must ensure `{"tenantId": "2"}` in the file.
Login into https://web2-withterria.dev.magda.io/auth/login/ckan then post the json data in [magda/registry/sample-records/demo2.json](magda/registry/sample-records/demo2.json)
 to https://web2-withterria.dev.magda.io/api/v0/registry-auth/records

At the moment, Magda treats all admin users the same. That is, any admin users will be able to perform any admin tasks. 
In the future, the `web1-*` admin should not have write access to `web2-*`'s data.

## Deploy Terria Map server to Google Cloud
The standard gitlab pileline job does not deploy the Terria Map server. We need to manually deploy it ourself by executing the following two commands.
```
  kubectl.exe --context gke_terriajs_asia-east1-a_dev-new --namespace withterria create deploy terria-map --image=mwu2019/multi-tenant-terria-map
  kubectl.exe --context gke_terriajs_asia-east1-a_dev-new --namespace withterria create service clusterip terria-map --tcp 3001:3001
```
Note that the github repository "mwu2019" for the image "multi-tenant-terria-map" is temporary. The image was built from the current branch "withMagda".

## Browse websites
Run
```
kubectl.exe --context gke_terriajs_asia-east1-a_dev-new --namespace withterria get pod
```
If pod `terria-map-<xxxx>` becomes ready, you can visit
* https://web1-withterria.dev.magda.io
* https://web2-withterria.dev.magda.io

You will notice that the two websites have different datasets.

## Local development
### Build TerriaMap
#### Define environment variables
By default, a TerriaMap server is built by using config file [wwwroot/config.json](wwwroot/config) and serves contents
in directory wwwroot. To build a TerriaMap using Magda as a backend, please create file ".env" in the root directory
then add the following line in the file:
```
MAGDA_GATEWAY=true
```
You may also define more enviroment variables in `.env`, e.g., adding a second line if you wish:
```
NODE_ENV=development
```
Please do not commit the `.env` file.

#### Build TerriaMap Image
Run command:
```
yarn run gulp --release
yarn run docker-build-local
```
### Deploy Terria Map
```
kubectl.exe --context minikube create deploy terria-map --image=localhost:5000/data61/terria-terriamap
kubectl.exe --context minikube create service clusterip terria-map --tcp 3001:3001
```

### Prepare Magda

#### Check out Magda
Check out branch [withterria](https://github.com/magda-io/magda/tree/withterria) from repository 
[magda](https://github.com/magda-io/magda.git).

#### Build local docker images
The following containers are needed:
* combined-db-0
* registry-api
* authorization-api
* gateway

#### Resolve domain names
We will use minikube for local development. All the three previously mentioned domain names (admin, web1 and web2) should have resolved to the minikube external IP address (192.168.99.100).
However, we should not use the real domain names. Otherwise the following setting may not work properly. We will make some fake domain names by appending `.local` to all the three real domain names.

If on a Windows platform, add the following lines to file `C:\Windows\System32\drivers\etc\hosts`. 
```
192.168.99.100 admin-withterria.dev.magda.io.local
192.168.99.100 web1-withterria.dev.magda.io.local
192.168.99.100 web2-withterria.dev.magda.io.local
```
It will make all the three fake domain names resolve to minikube ip address.

#### Deploy magda to minikube
Copy [magda-terria-minikube.yml](magda/deploy/magda-terria-minikube.yml) of this project to the directory `magda/deploy/helm` of the magda project. Then run
```
cd magda

helm upgrade magda deploy/helm/magda -f deploy/helm/magda-terria-minikube.yml
```
The magda will be accessible via port 30100. Note that the ingress is not deployed.

### Create terria aspects
Post the following json data to the magda admin portal http://admin-withterria.dev.magda.io.local:30100/api/v0/registry/aspects. Note that we must specify port number 30100.
* [magda/registry/aspects/terria-config.schema.json](magda/registry/aspects/terria-config.schema.json)
* [magda/registry/aspects/terria-catalog.schema.json](magda/registry/aspects/terria-catalog.schema.json)

### Create some tenants
Post the following json data to the magda admin portal http://admin-withterria.dev.magda.io.local:30100/api/v0/registry/tenants.
Note that we must specify port number 30100.
* [magda/registry/tenants/tenant1.json](magda/registry/tenants/tenant1.json) (Append `.local` to the value of `domainName` in the file before POST.)
* [magda/registry/tenants/tenant2.json](magda/registry/tenants/tenant2.json) (Append `.local` to the value of `domainName` in the file before POST.)

Then make a GET request to  http://admin-withterria.dev.magda.io.local:30100/refreshTenants.

### Create some tenant records
Note: The URLs are tenant specific.
#### Create a record for tenant of domain "web1-withterria.dev.magda.io.local"
In [magda/registry/sample-records/demo1.json](magda/registry/sample-records/demo1.json), modify the content from
```
  "initializationUrls": [
    "https://web1-withterria.dev.magda.io/api/v0/registry/records/terria_map/aspects/terria-catalog.json"
  ]
```
to 
```
  "initializationUrls": [
    "http://web1-withterria.dev.magda.io.local:30100/api/v0/registry/records/terria_map/aspects/terria-catalog.json"
  ]
```
Note that 
1. `https` is replaced by `http`.
2. `web1-withterria.dev.magda.io` is replaced by `web1-withterria.dev.magda.io.local:30100`.

After the revision, post [it](magda/registry/sample-records/demo1.json) to http://web1-withterria.dev.magda.io.local:30100/api/v0/registry/records.

#### Create a record for tenant of domain "web2-withterria.dev.magda.io.local"
Post the json data in [magda/registry/sample-records/demo2.json](magda/registry/sample-records/demo2.json) to http://web2-withterria.dev.magda.io.local:30100/api/v0/registry/records after making similar revision as web1.


### Testing
#### Visit website web1-withterria.dev.magda.io.local
* Open a browser, navigate to http://web1-withterria.dev.magda.io.local:30100.
* Click on "Add data", the "Example datasets" should contain "Data.gov.au" only.

#### Visit website web2-withterria.dev.magda.io.local
* Open a browser, navigate to http://web2-withterria.dev.magda.io.local:30100.
* Click on "Add data", the "Example datasets" should contain "Small glTF 3D Models" only.

#### Change datasets for website web1-withterria.dev.magda.io.local
* To replace its datasets, use PATCH method to send data in [magda/registry/sample-records/replace-first-catalog.json](magda/registry/sample-records/replace-first-catalog.json) to URL http://web1-withterria.dev.magda.io.local:30100/api/v0/registry/records/terria_map
* Refresh the browser at http://web1-withterria.dev.magda.io.local:30100, the "Example datasets" should be changed a lot. 
