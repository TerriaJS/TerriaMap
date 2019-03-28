Terria Map
==========

![Terria logo](terria-logo.png "Terria logo")

[![Greenkeeper badge](https://badges.greenkeeper.io/TerriaJS/TerriaMap.svg)](https://greenkeeper.io/)

This is a complete website built using the TerriaJS library. See the [TerriaJS README](https://github.com/TerriaJS/TerriaJS) for information about TerriaJS, and getting started using this repository.

# Experiment with Magda
## Goals
* A single Terria Map server serves many different Terria Map websites. Each website will have its own domain name.
* The Terria Map server dynamically configures each website with customised initial catalogs.
* The initial catalogs can be dynamically updated via the corresponding website admin portal.
* Other contents are also served dynamically based on website domain names.

## Design
* The Magda gateway will proxy the Terria Map server.
* A customised website configuration data can be created, deleted, retrieved, patched or updated via the website's admin portal.
* All Terria Map website domain names will resolve to the Magda gateway external IP address.
* The Terria Map server is behind the Magda gateway.
* Tenant management is via Magda admin portal that also resolves to the Magda gateway external IP address.

## Demo
Two demo websites might be found at 
1. https://web1-multi-tenant.dev.magda.io
2. https://web2-multi-tenant.dev.magda.io

Each website will have its own datasets and "look-and-feel".

## Next step proposal
### Tenant management UI
This is for the magda platform admin to manage terria aspects and all tenants, e.g., via URL https://admin-multi-tenant.dev.magda.io/terriaAdmin.

### Tenant website management UI
This is for each tenant website's admin to configure and manage their own website. For example, The admin of website https://web1-multi-tenant.dev.magda.io 
can manage the website's datasets via URL https://web1-multi-tenant.dev.magda.io/terriaAdmin.

## Development instructions
### Magda

#### Code
The development of Magda with multi-tenant support is in the branch of [multi-tenant](https://github.com/magda-io/magda/tree/multi-tenant) in
the repository of [magda](https://github.com/magda-io/magda.git).

#### Deploy Magda to Google Cloud
If it is the first time using the Magda gitlab infrastructure to deploy magda with multi-tenant support, follow the steps below.
1. Check out the "multi-tenant" branch.
2. Edit at least one file, e.g. set `registry-api: skipAuthorization` to `true` in file `deploy/helm/preview.yml` then commit and push the change, which will trigger gitlab pipeline jobs. 
3. After all the dockerize jobs are completed, the magda images will have tags of `multi-tenant` in `registry.gitlab.com/magda-data/magda/data61`. Manually trigger the job `(No Data) Run As Preview`, which will create a `multi-tenant` namespace, all neccessary secrets and deploy the magda.

### Resolve domain names
To demonstrate the multi-tenant features, We will use the following URLs.
* The URL https://admin-multi-tenant.dev.magda.io, for magda management.
* The URL https://web1-multi-tenant.dev.magda.io, for the first tenant website.
* The URL https://web2-multi-tenant.dev.magda.io, for the second tenant website.

To resolve the domain names in the above URLs, we need to edit ingress manually after the magda deployment. Run
```
  kubectl --context=gke_terriajs_asia-east1-a_dev-new --namespace=multi-tenant edit ingress ingress
```

A text editor will pop up with content similar to the following
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
  namespace: multi-tenant
  resourceVersion: "141147691"
  selfLink: /apis/extensions/v1beta1/namespaces/multi-tenant/ingresses/ingress
  uid: 0a203e48-4e8c-11e9-828d-42010af0024b
spec:
  rules:
  - host: multi-tenant.dev.magda.io
    http:
      paths:
      - backend:
          serviceName: gateway
          servicePort: 80
        path: /
  tls:
  - hosts:
    - multi-tenant.dev.magda.io
status:
  loadBalancer:
    ingress:
    - ip: 35.201.203.227
```
This ingress is configured by the pipeline job that is targeted at the single-tenant magda deployment.
We need to modifiy it for the multi-tenant deployment by replacing the existing single `host` in the `rules` section with the following three new hosts:
```
- host: admin-multi-tenant.dev.magda.io
    http:
      paths:
      - backend:
          serviceName: gateway
          servicePort: 80
        path: /
  - host: web1-multi-tenant.dev.magda.io
    http:
      paths:
      - backend:
          serviceName: gateway
          servicePort: 80
        path: /
  - host: web2-multi-tenant.dev.magda.io
    http:
      paths:
      - backend:
          serviceName: gateway
          servicePort: 80
        path: /
```
Also replace the `- multi-tenant.dev.magda.io` in `hosts` of `tls` section with `- admin-multi-tenant.dev.magda.io`. The final text looks like:
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
  namespace: multi-tenant
  resourceVersion: "141147691"
  selfLink: /apis/extensions/v1beta1/namespaces/multi-tenant/ingresses/ingress
  uid: 0a203e48-4e8c-11e9-828d-42010af0024b
spec:
  rules:
  - host: admin-multi-tenant.dev.magda.io
    http:
      paths:
      - backend:
          serviceName: gateway
          servicePort: 80
        path: /
  - host: web1-multi-tenant.dev.magda.io
    http:
      paths:
      - backend:
          serviceName: gateway
          servicePort: 80
        path: /
  - host: web2-multi-tenant.dev.magda.io
    http:
      paths:
      - backend:
          serviceName: gateway
          servicePort: 80
        path: /
  tls:
  - hosts:
    - admin-multi-tenant.dev.magda.io
status:
  loadBalancer:
    ingress:
    - ip: 35.201.203.227
```
Save the final text and close the editor. Now all the above three URLs will resolve to the gateway external IP address.

### Magda admin tasks
The magda admin needs to add some terria aspects and some tenants in the registry database.
Before an [admin portal UI](#Tenant-management-UI) becomes available, we have to use other tools such as Postman to do the jobs. 

#### Add terria aspects
Post the following json data to https://admin-multi-tenant.dev.magda.io/api/v0/registry/aspects.
* [magda/registry/aspects/terria-config.schema.json](magda/registry/aspects/terria-config.schema.json)
* [magda/registry/aspects/terria-catalog.schema.json](magda/registry/aspects/terria-catalog.schema.json)

#### Add tenants
Post the following json data to https://admin-multi-tenant.dev.magda.io/api/v0/registry/tenants.
* [magda/registry/tenants/tenant1.json](magda/registry/tenants/tenant1.json)
* [magda/registry/tenants/tenant2.json](magda/registry/tenants/tenant2.json)

After adding the two tenants, we need to make a GET request to https://admin-multi-tenant.dev.magda.io/refreshTenants to "activate" them.

### Tenant website admin tasks
Tenant website admins are responsible to configure their own terria websites. Before the [website admin portal UI](#Tenant-website-management-UI)
becomes available, we have to use other tools such as Postman to do the jobs. 
#### Add a record for the first website
Post the json data in [magda/registry/sample-records/demo1.json](magda/registry/sample-records/demo1.json) to https://web1-multi-tenant.dev.magda.io/api/v0/registry/records
#### Add a record for the second website
Post the json data in [magda/registry/sample-records/demo2.json](magda/registry/sample-records/demo2.json) to https://web2-multi-tenant.dev.magda.io/api/v0/registry/records

### Security
Recall that in Step 2 of [Deploy Magda to Google Cloud](#Deploy-Magda-to-Google-Cloud), we set `registry-api: skipAuthorization` to `true` in the file `magda/deploy/helm/preview.yml`, which allows us to add aspects, tenants and tenant records without any authorization. This is OK during the development stage. After adding those data, we should set its value to `false` then redeploy. Note that we need to set current context first.
```
kubectl.exe config use-context gke_terriajs_asia-east1-a_dev-new

helm upgrade multi-tenant deploy/helm/magda --install --recreate-pods --namespace multi-tenant -f deploy/helm/preview.yml --set global.image.repository=registry.gitlab.com/magda-data/magda/data61,global.image.tag=multi-tenant,ingress.hostname=admin-multi-tenant.dev.magda.io,combined-db.waleBackup.method=NONE,elasticsearch.useGcsSnapshots=false,global.externalUrl=https://admin-multi-tenant.dev.magda.io,global.namespace=multi-tenant
```
Now all write accesses require authorization. For example, you will get message "The resource requires authentication, which was not supplied with the request" if you try to [add tenants](#Add-tenants).

The redeployment might also change the ingress. We may need to edit it again according to [Resolve domain names](#Resolve-domain-names).

#### Login as admin user
Before an admin UI and a login UI become available, we have to manually create user account and manually login onto magda. Magda uses third-party authentication service, such as `data.gov.au`, facebook and google. 

Take `data.gov.au` as an example.
##### Create your account
To create your `data.gov.au account`, navigate to https://data.gov.au/data/user/register and set your `username` and `password`.

To create your magda admin account, manually insert a record into table `users` of database `auth` in Magda, using the following sql script (Replace `<...>` with real values):
```
INSERT INTO public.users(
	id, "displayName", email, "photoURL", source, "sourceId", "isAdmin")
	VALUES ('<a uuid>', '<My Name>', '<my email address>', '<my photo url>', 'ckan', '<username>', true);
```
After the insertion, `<username>` will become an admin user.

##### Login
Navigate to https://admin-multi-tenant.dev.magda.io/auth/login/ckan
A very primative UI will appear. Fill in your data.gov.au username and password then submit. If successful, another very primative UI will appear, indicating that "You are logged in."

##### Access to private data
Once you are logged in as admin, you can view private data in the "auth" database.
Navigate to https://admin-multi-tenant.dev.magda.io/api/v0/auth/users/all. You should see all users.

#### Perform terria related admin tasks
Once you are able to login as magda admin, you will be able to perform all admin tasks [here](#Magda-admin-tasks) and [here](#Tenant-website-admin-tasks) without skipping registry authorization.

Note that when `skipAuthorization` is set to `false`, any write access to registry api MUST use the path 
`/api/v0/registry-auth`. That is, you can only make POST, PUT, PATCH, UPDATE and DELETE requests after logging into 
each of the following URLs:
1. https://admin-multi-tenant.dev.magda.io/api/v0/registry-auth/aspects.
2. https://admin-multi-tenant.dev.magda.io/api/v0/registry-auth/tenants.
3. https://web1-multi-tenant.dev.magda.io/api/v0/registry-auth/records.
4. https://web2-multi-tenant.dev.magda.io/api/v0/registry-auth/records.

At the moment, Magda treats all admin users the same. That is, any admin users will be able to perform any admin tasks. In the future, a role based access model will be used. For example, when that model is implemented, `web1-*` admin will not have write access to `web2-*`'s data.

## Deploy Terria Map server to Google Cloud
The standard gitlab pileline job does not deploy the Terria Map server. We need to manually deploy it ourself by executing the following two commands.
```
  kubectl.exe --context gke_terriajs_asia-east1-a_dev-new --namespace multi-tenant create deploy terria-map --image=mwu2019/multi-tenant-terria-map
  kubectl.exe --context gke_terriajs_asia-east1-a_dev-new --namespace multi-tenant create service clusterip terria-map --tcp 3001:3001
```
Note that the github repository "mwu2019" for the image "multi-tenant-terria-map" is temporary. The image was built from the current branch "withMagda".

## Browse websites
Open a browser and visit
* https://web1-multi-tenant.dev.magda.io
* https://web2-multi-tenant.dev.magda.io

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
Check out branch [multi-tenant](https://github.com/magda-io/magda/tree/multi-tenant) from repository 
[magda](https://github.com/magda-io/magda.git).

#### Build local docker images
The following containers are needed:
* combined-db-0
* registry-api
* authorization-api
* gateway

#### Resolve domain names
We will use minikube for local development. All the three previously mentioned domain names (admin, web1 and web2) should have resolved to the minikube external IP address (192.168.99.100).  However, we should not use the real domain names. Otherwise the following setting may not work properly. We will make some fake domain names by appending `.local` to all the three real domain names.

If on a Windows platform, add the following lines to file `C:\Windows\System32\drivers\etc\hosts`. 
```
192.168.99.100 admin-multi-tenant.dev.magda.io.local
192.168.99.100 web1-multi-tenant.dev.magda.io.local
192.168.99.100 web2-multi-tenant.dev.magda.io.local
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
Post the following json data to the magda admin portal http://admin-multi-tenant.dev.magda.io.local:30100/api/v0/registry/aspects. Note that we must specify port number 30100.
* [magda/registry/aspects/terria-config.schema.json](magda/registry/aspects/terria-config.schema.json)
* [magda/registry/aspects/terria-catalog.schema.json](magda/registry/aspects/terria-catalog.schema.json)

### Create some tenants
Post the following json data to the magda admin portal http://admin-multi-tenant.dev.magda.io.local:30100/api/v0/registry/tenants.
Note that we must specify port number 30100.
* [magda/registry/tenants/tenant1.json](magda/registry/tenants/tenant1.json) (Append `.local` to the value of `domainName` in the file before POST.)
* [magda/registry/tenants/tenant2.json](magda/registry/tenants/tenant2.json) (Append `.local` to the value of `domainName` in the file before POST.)

Then make a GET request to  http://admin-multi-tenant.dev.magda.io.local:30100/refreshTenants.

### Create some tenant records
Note: The URLs are tenant specific.
#### Create a record for tenant of domain "web1-multi-tenant.dev.magda.io.local"
In [magda/registry/sample-records/demo1.json](magda/registry/sample-records/demo1.json), modify the content from
```
  "initializationUrls": [
    "https://web1-multi-tenant.dev.magda.io/api/v0/registry/records/terria_map/aspects/terria-catalog.json"
  ]
```
to 
```
  "initializationUrls": [
    "http://web1-multi-tenant.dev.magda.io.local:30100/api/v0/registry/records/terria_map/aspects/terria-catalog.json"
  ]
```
Note that 
1. `https` is replaced by `http`.
2. `web1-multi-tenant.dev.magda.io` is replaced by `web1-multi-tenant.dev.magda.io.local:30100`.

After the revision, post [it](magda/registry/sample-records/demo1.json) to http://web1-multi-tenant.dev.magda.io.local:30100/api/v0/registry/records.

#### Create a record for tenant of domain "web2-multi-tenant.dev.magda.io.local"
Post the json data in [magda/registry/sample-records/demo2.json](magda/registry/sample-records/demo2.json) to http://web2-multi-tenant.dev.magda.io.local:30100/api/v0/registry/records after making similar revision as web1.


### Testing
#### Visit website web1-multi-tenant.dev.magda.io.local
* Open a browser, navigate to http://web1-multi-tenant.dev.magda.io.local:30100.
* Click on "Add data", the "Example datasets" should contain "Data.gov.au" only.

#### Visit website web2-multi-tenant.dev.magda.io.local
* Open a browser, navigate to http://web2-multi-tenant.dev.magda.io.local:30100.
* Click on "Add data", the "Example datasets" should contain "Small glTF 3D Models" only.

#### Change datasets for website web1-multi-tenant.dev.magda.io.local
* To replace its datasets, use PATCH method to send data in [magda/registry/sample-records/replace-first-catalog.json](magda/registry/sample-records/replace-first-catalog.json) to URL http://web1-multi-tenant.dev.magda.io.local:30100/api/v0/registry/records/terria_map
* Refresh the browser at http://web1-multi-tenant.dev.magda.io.local:30100, the "Example datasets" should be changed a lot. 
