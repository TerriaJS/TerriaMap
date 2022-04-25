// require('dotenv').config();
var env = require('node-env-file');
var fs = require('fs');

console.log(`
.d88b 8888 8    8888 .d88b      8    8 888b.    db
8P    8www 8    8www 8P         8    8 8   8   dPYb
8b    8    8    8    8b    wwww 8b..d8 8   8  dPwwYb
 Y88P 8888 8888 8888  Y88P       Y88P  888P' dP    Yb

`)

env(__dirname + '/.env');

console.log("Creating CELEC configuration file from environment variables....")

console.log("GEOSERVER_URL=", process.env.GEOSERVER_URL)
console.log("GRAFANA_URL=", process.env.GRAFANA_URL)

fs.readFile("./wwwroot/init/simple.json", 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/\$GEOSERVER_URL/g, process.env.GEOSERVER_URL);

  result = result.replace(/\$GRAFANA_URL/g, process.env.GRAFANA_URL);

  fs.writeFile('./wwwroot/init/celec.json', result, 'utf8', function (err) {
     if (err) return console.log(err);
     console.log("CELEC configuration file ./wwwroot/init/celec.json created successful 🚀🚀🚀")
  });
});
fs.readFile("./wwwroot/init/simple_energia.json", 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/\$GEOSERVER_URL/g, process.env.GEOSERVER_URL);

  result = result.replace(/\$GRAFANA_URL/g, process.env.GRAFANA_URL);

  fs.writeFile('./wwwroot/init/celec_energia.json', result, 'utf8', function (err) {
    if (err) return console.log(err);
    console.log("CELEC configuration file ./wwwroot/init/celec_energia.json created successful 🚀🚀🚀")
  });
});
fs.readFile("./wwwroot/init/simple_geo.json", 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/\$GEOSERVER_URL/g, process.env.GEOSERVER_URL);

  result = result.replace(/\$GRAFANA_URL/g, process.env.GRAFANA_URL);

  fs.writeFile('./wwwroot/init/celec_geo.json', result, 'utf8', function (err) {
    if (err) return console.log(err);
    console.log("CELEC configuration file ./wwwroot/init/celec_geo.json created successful 🚀🚀🚀")
  });
});
