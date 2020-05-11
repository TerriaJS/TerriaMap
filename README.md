
New Install
Last edited: 4/28

Set up
Requirements:
Yarn and Node v10. (V10 its important, otherwise gulp may fail).
 
Installation
```
git clone https://github.com/RECEIPT-H2020/TerriaMap.git
cd TerriaMap
mkdir packages && cd packages
git clone https://github.com/RECEIPT-H2020/terriajs.git
cd ..
nvm use 10 <- it is necessary to run gulp on node version 10
yarn install
npx gulp
```

Note: you may need to run gulp sync-terriajs-dependencies and then yarn install and npx gulp again
Note 2: PM2 causes problems with old installations. run rm -rf ~/.pm2 to clean up or npx pm2 update
 
 
Run local server
from TerriaMaps folder:
```
npm start
npx gulp watch
```
Happy coding :)

Please note:
Master Banches for out forks are named 'receipt'
If you create a feature branch, try to change one branch at the time, and make sure that everything runs properly with the master branches of the rest of the repositories before pushing.
Use prettier while formatting your code and set it up to prettify on 'file save'
Cesium Access token

  
You can create a new token at https://cesium.com/ion or use the temporary token:
 
```TerriaMap > wwwroot > config.json ```

inside the parameters object: 

```cesiumIonAccessToken: <ACCESS_TOKEN>```
