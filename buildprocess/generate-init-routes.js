var fs = require("fs");
var path = require("path");
var URI = require("urijs");
var CATALOG_ROUTE = require("terriajs/lib/ReactViewModels/TerriaRouting").CATALOG_ROUTE;

const rootGroupName = "Root Group";

const getNameFromItem = item => item.name;
const getIdFromItem = item => item.id;


const getRoutes = (topCatalogItem, currentRoute = rootGroupName) =>
  topCatalogItem.reduce((acc, catalogItem) => {
    const nameForCurrentItem = getNameFromItem(catalogItem);
    // Id is used for uniqueid, so disregard any pathing
    const idFromItem = getIdFromItem(catalogItem);
    const finalRoute = idFromItem || `${currentRoute}/${nameForCurrentItem}`;
    const items = catalogItem.items && getRoutes(catalogItem.items, finalRoute);

    if (items) {
      return [...acc, ...items, finalRoute];
    }
    return [...acc, finalRoute];
  }, []);
/**
 * Given an array of init names for files in wwwroot/init/, traverse the catalog
 * and generate a list of routes to be prerendered at build time
 * 
 * @param  {Array} initUrls
 */
function generateRoutes(initUrls) {
  const resUrl = url =>
    path.resolve(__dirname, "..", "wwwroot", "init", `${url}.json`);
  
  const getCatalogFromInitName = initName => resUrl(initName);

  const routesFromInitCatalogs = initUrls.reduce((acc, initName) => {
    const fsPathForInit = getCatalogFromInitName(initName);
    const data = fs.readFileSync(fsPathForInit, "utf8");
    const literal = JSON.parse(data).catalog;

    return [...acc, ...getRoutes(literal, `${rootGroupName}`)];
  }, []);

  const encodedRoutes = routesFromInitCatalogs.map(route => `${CATALOG_ROUTE}${URI.encode(route)}`);

  // Make sure we also prerender /catalog/ incase user reloads on it? or serve up in terriajs server?
  return [CATALOG_ROUTE, ...encodedRoutes];
}

module.exports = generateRoutes;
