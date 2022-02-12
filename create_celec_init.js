require('dotenv').config()
var fs = require('fs')

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