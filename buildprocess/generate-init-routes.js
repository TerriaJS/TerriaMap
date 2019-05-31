var fs = require("fs");
var path = require("path");

const rootGroupName = "Root Group";

const getNameFromItem = item => item.id || item.name;

const resUrl = url =>
  path.resolve(__dirname, "..", "wwwroot", "init", `${url}.json`);

const getCatalogFromInitName = initName => resUrl(initName);

const getRoutes = (topCatalogItem, currentRoute = rootGroupName) =>
  topCatalogItem.reduce((acc, catalogItem) => {
    const nameForCurrentItem = getNameFromItem(catalogItem);
    const finalRoute = `${currentRoute}/${nameForCurrentItem}`;
    const items = catalogItem.items && getRoutes(catalogItem.items, finalRoute);

    if (items) {
      return [...acc, ...items, finalRoute];
    }
    return [...acc, finalRoute];
  }, []);

function generateRoutes(initUrls) {
  return initUrls.reduce((acc, initName) => {
    const fsPathForInit = getCatalogFromInitName(initName);
    const data = fs.readFileSync(fsPathForInit, "utf8");
    const literal = JSON.parse(data).catalog;

    return [...acc, ...getRoutes(literal, rootGroupName)];
  }, []);
}

module.exports = generateRoutes;
