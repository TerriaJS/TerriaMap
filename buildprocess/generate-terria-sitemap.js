const generateUrl = (loc, lastmod, changefreq, priority) => (`
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`);

/**
 * Generate a sitemap to be written out during build
 * 
 * @param  {string} baseUrl absolute URL to where your map is going to be deployed to, with a trailing slash
 * @param  {array} catalogRoutes list of routes, e.g. ['/catalog', '/catalog/someId']
 */
const generateTerriaSitemap = (baseUrl, catalogRoutes) => {
  if (typeof baseUrl !== 'string') {
    throw 'baseUrl passed to generateTerriaSitemap is not a string?'; 
  }
  if (baseUrl.substr(0,4) !== 'http') {
    throw 'baseUrl does not look absolute, check that it begins with http or https';
  }
  const baseUrlWithoutTrailingSlash = (baseUrl.substr(-1) === '/') ? baseUrl.slice(0,-1) : baseUrl;
  const date = new Date().toISOString().substr(0, 10);

  const start = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetStart = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetEnd = `</urlset>`;
  const homeUrl = generateUrl(baseUrl, date, 'daily', '0.9');
  const routeUrls = catalogRoutes.map(route => generateUrl(`${baseUrlWithoutTrailingSlash}${route}`, date, 'weekly', '0.5'));
  
  return `${start}${urlsetStart}${homeUrl}${routeUrls.join('')}${urlsetEnd}`;
};

module.exports = generateTerriaSitemap;
