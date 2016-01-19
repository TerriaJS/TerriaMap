Change Log
==========

### 2016-01-19

* Fixed incorrect claims in the documentation that NationalMap was funed by the Department of Prime Minister and Cabinet.

### 2016-01-15

* Removed `National Data Sets -> Land -> Catchment Scale Land Use 2014`.
* Removed hardcoded descriptions from the Mobile Black Spot datasets, allowing descriptions provided by the server to be used instead.
* Split out server-side code into a separate repo, github.com/TerriaJS/terriajs-server and NPM package 'terriajs-server'.
* Remove Supervisor and Forever, as they're basically redundant.
* Reworked "npm start" and "npm stop" so they start/stop TerriaJS-Server in the background.
* The disclaimer no longer overlaps with the map credits when printing the 2D view in Chrome.
* Fixed the City of Melbourne datasets.  An upgrade of their Socrata server broke functionality we relied on.
* Updated to [TerriaJS](https://github.com/TerriaJS/terriajs) 1.0.53.  Significant changes relevant to NationalMap users include:
  * Fixed a typo that prevented clearing the search query on the Search tab.
  * Added a progress bar to the top of the map, indicating tile download progress.
  * We no longer show the entity's ID (which is usually a meaningless GUID) on the feature info panel when the feature does not have a name.  Instead, we leave the area blank.
  * Fixed a bug with time-dynamic imagery layers that caused features to be picked from the next time to be displayed, in addition to the current one.
  * `Cesium.zoomTo` now takes the terrain height into account when zooming to a rectangle.
  * Dramatically improved the performance of region mapping.
  * Introduced new quantisation (color binning) methods to dramatically improve the display of choropleths (numerical quantities displayed as colors) for CSV files, instead of always using linear. Four values for `colorBinMethod` are supported:
    * "auto" (default), usually means "ckmeans"
    * "ckmeans": use "CK means" method, an improved version of Jenks Even Breaks to form clusters of values that are as distinct as possible.
    * "quantile": use quantiles, evenly distributing values between bins
    * "none": use the previous linear color mapping method.
  * The default style for CSV files is now 7 color bins with CK means method.
  * Added support for color palettes from Color Brewer (colorbrewer2.org). Within `tableStyle`, use a value like `"colorPalette": "10-class BrBG"`.
  * Improved the display of legends for CSV files.
  * Added support for the Socrata "new backend" with GeoJSON download to `SocrataCatalogGroup`.
  * Improved compatibility with Internet Explorer 9.

### 2015-12-15

* Added Department of Environment datasets under `National Data Sets -> Environment`.
* Added Soil and Landscape Grid data under `National Data Sets -> Land`.
* Add NEII Viewer and AURIN Map to Related Maps.
* Fixed display of map preview images in Related Maps.
* Fixed the squished images on the Related Maps panel.
* Updated to [TerriaJS](https://github.com/TerriaJS/terriajs) 1.0.50.  Significant changes relevant to NationalMap users include:
  * Fixed a bug that caused poor performance when clicking a point on the map with lots of features and then closing the feature information panel.
  * Legend URLs are now accessed via the proxy, if applicable.
  * Fixed a bug that caused a `TypeError` on load when the share URL included enabled datasets with an order different from their order in the catalog.
  * Improved the message that is shown to the user when their browser supports WebGL but it has a "major performance caveat".
  * Fixed a bug that could cause an exception in some browsers (Internet Explorer, Safari) when loading a GeoJSON with embedded styles.
  * Fixed a bug with Leaflet 2D map where clicks on animation controls or timeline would also register on the map underneath causing undesired feature selection and, when double clicked, zooming (also removed an old hack that disabled dragging while using the timeline slider)
  * Changed Australian Topography base map server and updated the associated thumbnail.
  * Added `updateApplicationOnMessageFromParentWindow` function.  After an app calls this function at startup, TerriaJS can be controlled by its parent window when embedded in an `iframe` by messages sent with `window.postMessage`.
  * Put a white background behind legend images to fix legend images with transparent background being nearly invisible.
  * Search entries are no longer duplicated for catalog items that appear in multiple places in the Data Catalogue
  * Fixed the layer order changing in Cesium when a CSV variable is chosen.
  * Layer name is now shown in the catalog item info panel for ESRI ArcGIS MapServer layers.
  * Retrieve WFS or WCS URL associated with WMS data sources using DescribeLayer if no dataUrl is present.
  * Sorted ABS age variables numerically, not alphabetically.
  * Fixed a bug that prevented region mapping from working over HTTPS.
  * The proxy is now used to avoid a mixed content warning when accessing an HTTP dataset from an HTTPS deployment of TerriaJS.

### 2015-11-16

* Completely support the [csv-geo-au](https://github.com/NICTA/nationalmap/wiki/csv-geo-au) specification (other than SA1s and boundaries from previous years) including ASGS boundaries like remoteness regions, indigenous areas and non ASGS boundaries like primary health networks.
* Added freight route datasets provided by the Department of Infrastructure and Regional Development under `Transport -> Freight`.
* Added IMOS and AODN Geoservers to the list of hosts that may be proxied.
* Changed the support email address from `nationalmap@communications.gov.au` to `data@pmc.gov.au`.
* Use YouTube videos hosted in the AusGovDPMC account.
* Updated to [TerriaJS](https://github.com/TerriaJS/terriajs) 1.0.48.  Significant changes relevant to NationalMap users include:
  * Update the default Australian topography basemap to Geoscience Australia's new worldwide layer (http://www.ga.gov.au/gisimg/rest/services/topography/National_Map_Colour_Basemap/MapServer)
  * The Feature Info panel now shows all selected features in an accordion control.  Previously it only showed the first one.
  * Major refactor of `CsvCatalogItem`, splitting region-mapping functionality out into `RegionProvider` and `RegionProviderList`. Dozens of new test cases. In the process, fixed a number of bugs and added new features including:
    * Regions can be matched using regular expressions, enabling matching of messy fields like local government names ("Baw Baw", "Baw Baw Shire", "Baw Baw (S)", "Shire of Baw Baw" etc).
    * Regions can be matched using a second field for disambiguation (eg, "Campbelltown" + "SA")
    * Drag-and-dropped datasets with a time column behave much better: rather than a fixed time being allocated to each row, each row occupies all the time up until the next row is shown.
    * Enumerated fields are colour coded in lat-long files, consist with region-mapped files.
    * Feedback is now provided after region mapping, showing which regions failed to match, and which matched more than once.
    * Bug: Fields with names starting with 'lon', 'lat' etc were too aggressively matched.
    * Bug: Numeric codes beginning with zeros (eg, certain NT 08xx postcodes) were treated as numbers and failed to match.
    * Bug: Fields with names that could be interpreted as regions weren't available as data variables.
  * The `LocationBarViewModel` now shows the latitude and longitude coordinates of the mouse cursor in 2D as well as 3D.
  * The `LocationBarViewModel` no longer displays a misleading elevation of 0m when in "3D Smooth" mode.
  * Applied markdown to properties shown in the Feature Info Panel.
  * HTML and Markdown text in catalog item metadata, feature information, etc. is now formatted in a more typical way.  For example, text inside `<h1>` now looks like a heading.  Previously, most HTML styling was stripped out.
  * The `name` of a feature from a CSV file is now taken from a `name` or `title` column, if it exists.  Previously the name was always "Site Data".
  * Most catalog items now automatically expose a `dataUrl` that is the same as their `url`.
  * Fixed a bug that caused time-dynamic WMS layers with just one time to not be displayed.
  * Underscores are now replaced with spaces in the feature info panel for `GeoJsonCatalogItem`.
  * Added Proj4 projections to the location bar. Clicking on the bar switches between lats/longs and projected coordinates. To enable this, set `useProjection` to `true`
  * Fixed a bug that caused an exception when running inside an `<iframe>` and the user's browser blocked 3rd-party cookies.
  * Fixed a bug that caused `WebMapServiceCatalogItem` to incorrectly populate the catalog item's metadata with data from GetCapabilities when another layer had a `Title` with the same value as the expected layer's `Name`.
  * Avoid mixed content warnings when using the CartoDB basemaps.
  * Handle WMS time interval specifications (time/time and time/time/periodicity)
  * Allow a single layer of an ArcGIS MapServer to be added through the "Add Data" interface.
  * Updated to [Cesium](http://cesiumjs.org) 1.15.  Significant changes relevant to TerriaJS users include:
    * Make KML invalid coordinate processing match Google Earth behavior. [#3124](https://github.com/AnalyticalGraphicsInc/cesium/pull/3124)
    * Fixed issues causing the terrain and sky to disappear when the camera is near the surface. [#2415](https://github.com/AnalyticalGraphicsInc/cesium/issues/2415) and [#2271](https://github.com/AnalyticalGraphicsInc/cesium/issues/2271)
    * Fixed issues causing the terrain and sky to disappear when the camera is near the surface. [#2415](https://github.com/AnalyticalGraphicsInc/cesium/issues/2415) and [#2271](https://github.com/AnalyticalGraphicsInc/cesium/issues/2271)
    * Provided a workaround for Safari 9 where WebGL constants can't be accessed through `WebGLRenderingContext`. Now constants are hard-coded in `WebGLConstants`. [#2989](https://github.com/AnalyticalGraphicsInc/cesium/issues/2989)
    * Added a workaround for Chrome 45, where the first character in a label with a small font size would not appear. [#3011](https://github.com/AnalyticalGraphicsInc/cesium/pull/3011)
    * Fixed an issue with drill picking at low frame rates that would cause a crash. [#3010](https://github.com/AnalyticalGraphicsInc/cesium/pull/3010)

### 2015-10-15

* Updated to [TerriaJS](https://github.com/TerriaJS/terriajs) 1.0.44.  Significant changes relevant to NationalMap users include:
  * Fixed a bug that could cause timeseries animation to "jump" when resuming play after it was paused.
  * When catalog items are enabled, the checkbox now animates to indicate that loading is in progress.
  * Add `mode=preview` option in the hash portion of the URL.  When present, it is assumed that TerriaJS is being used as a previewer and the "small screen warning" will not be shown.
  * Added the `attribution` property to catalog items.  The attribution is displayed on the map when the catalog item is enabled.
  * Fixed a bug that prevented `AbsIttCatalogGroup` from successfully loading its list of catalog items.
  * Allow missing URLs on embedded data (eg. embedded czml data)
  * Fixed a bug loading URLs for ArcGIS services names that start with a number.
* Updated to [Cesium](http://cesiumjs.org) 1.13.  Significant changes relevant to NationalMap users include:
  * The default `CTRL + Left Click Drag` mouse behavior is now duplicated for `CTRL + Right Click Drag` for better compatibility with Firefox on Mac OS [#2913](https://github.com/AnalyticalGraphicsInc/cesium/pull/2913).
  * Fixed an issue where non-feature nodes prevented KML documents from loading. [#2945](https://github.com/AnalyticalGraphicsInc/cesium/pull/2945)

### 2015-09-17

* Improved proxy cache expiration.  Previously, catalog item tiles could be cached by end-user browsers much longer than intended.
* Updated to [TerriaJS](https://github.com/TerriaJS/terriajs) 1.0.43.  Significant changes relevant to NationalMap users include:
  * Fixed a bug that prevented the opened/closed state of groups from being preserved when sharing.

### 2015-09-03

* Removed "beta" tag
* Added new screenshots and YouTube videos.
* Updated to [TerriaJS](https://github.com/TerriaJS/terriajs) 1.0.42. Relevant changes include:
  * Fixed a bug sharing CSV items.

### 2015-08-03

* Retired the NICTA-hosted geotopo250k data sets, replacing them with the Geoscience Australia Topography data sets.
* Removed the Topography group under Data Providers.
* Added URL shortening in the share popup, and support launch with shortened URLs.
* Added support for proxying POST requests to the proxy service.
* Populated ACT Government group by querying the ACT Socrata server.
* Added City of Melbourne and Sunshine Coast Council (QLD) to the Data Providers group.
* Added selection of region type (e.g. SA2) for ABS datasets to the Now Viewing tab.
* Updated to [TerriaJS](https://github.com/TerriaJS/terriajs) 1.0.41.  Significant changes relevant to NationalMap users include:
  * `CsvCatalogItem` can now have no display variable selected, in which case all points are the same color.
  * Added `CswCatalogGroup` for populating a catalog by querying an OGC CSW service.
  * Fixed a bug that prevented WMTS layers with a single `TileMatrixSetLink` from working correctly.
  * Added support for WMTS layers that can only provide tiles in JPEG format.
  * Fixed testing and caching of ArcGIS layers from tools and added More information option for imagery layers.
  * Made polygons drastically faster in 2D.
  * Added Google Analytics reporting of the application URL.  This is useful for tracking use of share URLs.
  * Added the ability to specify a specific dynamic layer of an ArcGIS Server using just a URL.
  * Fixed a race condition in `AbsIttCatalogItem` that could cause the legend and map to show different state than the Now Viewing UI suggested.
  * Fixed a bug where an ABS concept with a comma in its name (e.g. "South Eastern Europe,nfd(c)" in Country of Birth) would cause values for concept that follow to be misappropriated to the wrong concepts.
  * `ArcGisMapServerCatalogItem` now shows "NoData" tiles by default even after showing the popup message saying that max zoom is exceeded.  This can be disabled by setting its `showTilesAfterMessage` property to false.

### 2015-07-19

* Default to 2D on common mobile devices in order to make the app more performant, especially on older mobile devices.
* Significantly improved the experience on devices with small screens, such as phones.
* Start with the Data Catalogue panel hidden on devices with small screens.
* Switched the "Commonwealth Electoral Divisions" dataset to use the official boundaries from the Australia Electoral Commission.  Previously it used the Australian Bureau of Statistics versions.
* Additional ABS region support.  Now supported internally: AUS,STE,CED,SED,POA,LGA,SA4,SA1,SA2,SA1. Datasets exposing all of these are not yet available.
* The South Australian Government group is now populated by querying the SA CKAN server for GeoJSON and csv-geo-au resources.
* Use `mybroadband:` layers instead of `public:` layers for Broadband datsets.
* Access the Mobile Black Spot Programme datasets via WMS instead of CSV.
* Improved the look and feel of the Help and About pages.
* The elevation value displayed in the lower right corner is now a height above mean sea level (above the EGM96 geoid specifically) instead of a height above the WGS84 ellipsoid.
* Added two new base map options, both from CartoDB: Positron and Dark Matter.
* Updated to [TerriaJS](https://github.com/TerriaJS/terriajs) 1.0.36.  Significant changes relevant to NationalMap users include:
  * Fixed a bug that caused the 3D view to use significant CPU time even when idle.
  * Fixed a bug that caused the popup message to appear twice when a dataset failed to load.
  * Calculate extent of TopoJSON files so that the viewer correctly pans+zooms when a TopoJSON file is loaded.
  * Added ability to filter catalog search results by type: `is:wms`, `is:esri-mapserver`, `is:geojson` and so on.
  * Added layer information to the Info popup for WMS datasets.
  * Polygons from GeoJSON datasets are now filled.
  * Left-aligned feature info table column and added some space between columns.
  * Added support for styling GeoJSON files, either in catalog (add .style{} object) or embedded directly in the file following the [SimpleStyle spec](https://github.com/mapbox/simplestyle-spec).
  * Fixed a bug that prevented catalog items inside groups on the Search tab from being enabled.
  * Added support for discovering GeoJSON datasets from CKAN.
  * Added support for zipped GeoJSON files.
  * Made `KmlCatalogItem` use the proxy when required.
  * Made `FeatureInfoPanelViewModel` use the white panel background in more cases.
  * Fixed a bug that caused only the portion of a CKAN group name before the first comma to be used.
  * Added the `legendUrls` property to allow a catalog item to optionally have multiple legend images.
  * Added a popup message when zooming in to the "No Data" scales of an `ArcGisMapServerCatalogItem`.
  * Added a title text when hovering over the label of an enabled catalog item.  The title text informs the user that clicking will zoom to the item.
  * `CatalogItem.zoomTo` can now zoom to much smaller bounding box rectangles.
  * Upgraded to Cesium 1.11.

### 2015-07-03

* Changed the support email address from `nationalmap@lists.nicta.com.au` to `nationalmap@communications.gov.au`.
* Renamed "Gravity Image" to "Gravity Anomaly" and updated it to load from the new server (the old one is deprecated).
* Renamed "Magnetic Image" to "Magnetic Intensity" and updated it to load from the new server (the old one is deprecated).
* Updated the layer name used to access "SRTM 1 sec DEM Image".  The old one worked but was not advertised in the WMS server's GetCapabilities, which limited the quality of the metadata.
* The Data.gov.au group now includes CKAN resources with the `csv-geo-au` format.
* Improved the metadata, including descriptions and licence information, for many of the data sets in National Data Sets.
* Updated to [TerriaJS](https://github.com/TerriaJS/terriajs) 1.0.32.  Significant changes relevant to NationalMap users include:
  * Numerous changes to improve the quality of the catalogue item info page.
  * Added support for `csv-geo-*` (e.g. csv-geo-au) to `CkanCatalogGroup`.
  * `CkanCatalogGroup` now fills the `dataUrl` property of created items by pointing to the dataset's page on CKAN.
  * The catalog item information panel now displays `info` sections in a consistent order.  The order can be overridden by setting `CatalogItemInfoViewModel.infoSectionOrder`.
  * An empty `description` or `info` section is no longer shown on the catalog item information panel.  This can be used to remove sections that would otherwise be populated from dataset metadata.

### 2015-06-24

* Updated the favicon.
* Switched the new Medicare Offices dataset to load directly from data.gov.au.

### 2015-06-23

* Added "Medicare Offices" dataset under Social and Economic.
* Fixed the URL of the Roboto Mono font so that it downloads correctly even over `https`.
* Improved the styling of the About page.
* Fixed an incorrect link to the About page from the disclaimer at the bottom of the map.
* The nm.json file is now created at build time from a number of initialization files in the `datasources` directory.  The individual files are easier to manage and edit than a single large file.
* Updated to [TerriaJS](https://github.com/TerriaJS/terriajs) 1.0.27.  Significant changes relevant to NationalMap users include:
  * Fixed incorrect date formatting in the timeline and animation controls on Internet Explorer 9.
  * Added support for CSV files with longitude and latitude columns but no numeric value column.  Such datasets are visualized as points with a default color and do not have a legend.
  * The Feature Information popup is now automatically closed when the user changes the `AbsIttCatalogItem` filter.
  * `WebMapServiceCatalogItem` now determines its rectangle from the GetCapabilities metadata even when configured to use multiple WMS layers.
  * `AbsIttCatalogItem` styles can now be set using the `tableStyle` property, much like `CsvCatalogItem`.
  * Improved `AbsIttCatalogItem`'s tolerance of errors from the server.
  * Fixed a bug that caused the brand bar to slide away with the explorer panel on Internet Explorer 9.

### 2015-06-16

* Updated to [TerriaJS](https://github.com/TerriaJS/terriajs) 1.0.23.  Significant changes relevant to NationalMap users include:
  * Fixed a bug that prevented features from being pickable from ABS datasets on the 2D map.
  * Fixed a bug that caused the Explorer Panel tabs to be missing or misaligned in Firefox.
  * Changed to use JPEG instead of PNG format for the Natural Earth II basemap.  This makes the tile download substantially smaller.

### 2015-06-15

* Added a new Australian Bureau of Statistics group to the catalogue.
* Added all Australian states to the Data Catalogue.
* Replaced the Cesium animation and timeline controller with the new TerriaJS animation and timeline controller.
* National Map now shows its version number when hovering the mouse over the logo on the top left corner.
* Added a longer disclaimer to printed versions of the map.
* Added a Related Maps button and panel.  It currently contains links to AREMI and to the Northern Australia map.
* Added a small popup to call attention to the Now Viewing tab the first time a catalog item is enabled.
* Updated to [TerriaJS](https://github.com/TerriaJS/terriajs) 1.0.21.  Significant changes relevant to NationalMap users include:
  * Replaced the timeline / animation controller used with time-dynamic datasets.  The new one has a cleaner and simpler interface.
  * Added the ability to add an entire ArcGIS Server to the catalogue using the Add Data panel.
  * Improved the capabilities of the hidden Tools panel, accessed by appending `#tools=1` to the URL and clicking the Tools button.
  * Fixed a bug that caused the 2D / 3D buttons the Maps menu to get out of sync with the actual state of the map after switching automatically to 2D due to a performance problem.
  * Added support for connecting to Web Map Tile Service (WMTS) servers.

### 2015-05-28

* To hide the Explorer Panel at startup, the url can contain the parameter `hideEplorerPanel=1`.
* Upgraded to [TerriaJS 1.0.15](https://github.com/TerriaJS/terriajs/blob/1.0.15/CHANGES.md).  Significant changes relevant to National Map users include:
  * Esri ArcGIS MapServers can now be added via the "Add Data" panel.
  * We now support discovery of ArcGIS MapServer "Raster Layers" in addition to "Feature Layers".
  * Sharing now preserves the base map and view mode (2D/3D) selection.
  * Improved error handling in `CzmlCatalogItem`, `GeoJsonCatalogItem`, and `KmlCatalogItem`.
  * We now raise an error and hide the dataset when asked to show a layer in Leaflet and that layer does not use the Web Mercator (EPSG:3857) projection. Previously, the dataset would silently fail to display.
  * Fixed a bug that caused Internet Explorer 8 users to see a blank page instead of a message saying their browser is incompatible.

### 2015-05-15

* Dataset changes:
  * Added New South Wales Government
  * Added National Data Sets -> Surface Water -> Water Observations from Space
  * Added National Data Sets -> Social and Economic -> Housing Stress
  * Data Providers -> Water (Bureau of Meteorology Geofabric) now has sensible groups instead of a flat list.
* National Map is now built on [TerriaJS](http://www.github.com/TerriaJS/terriajs).  See the [changelog](https://github.com/TerriaJS/terriajs/blob/1.0.11/CHANGES.md) for the complete list of changes since TerriaJS split off from National Map.  Significant changes relevant to National Map users include:
  * The Search tab now searches the names of all datasets in the catalogue, including those in delay-loaded groups.
  * The 2D view once again correctly shows imagery attribution.
  * The catalog item info page now renders a much more complete set of Markdown and HTML elements.
  * Added support for region mapping based on region names instead of region numbers (example in `wwwroot/test/countries.csv`).
  * Added support for time-dynamic region mapping (example in `wwwroot/test/droughts.csv`).
  * Added the ability to region-map countries (example in `wwwroot/test/countries.csv`).
  * Esri ArcGIS MapServer datasets now show much more information when the user clicks the Info button.
  * Improved the appearance of the legends generating with region mapping.
  * Fixed a bug that caused features to be picked from all layers in an Esri MapServer, instead of just the visible ones.
  * Added support for the WMS MinScaleDenominator property and the Esri MapServer maxScale property, preventing layers using these properties from disappearing when zoomed in to close to the surface.
  * Fixed a bug that could cause the "Drop a data file anywhere" message to get stuck on when dragging a file over the application while a modal dialog was open.
  * Elminated distracting "jumping" of the selection indicator when picking point features while zoomed in very close to the surface.
  * The 3D viewer now shows Bing Maps imagery unmodified, matching the 2D viewer. Previously, it applied a gamma correction.
  * Polygons loaded from KML files are now placed on the terrain surface.
  * We no longer automatically fly to the first location when pressing Enter in the Search input box, because this was surprising and often didn't work well.
  * Checkboxes in the Data Catalogue and Search tabs now have a larger clickable area, which is especially helpful on touch screens.
  * The Feature Information functionality now works with servers that can only return HTML, and displays it appropriately.  This is especially useful for Google Maps Engine (GME) WMS servers.
* The Bing Maps API key can now be specified in config.json.

### 2015-04-15

* Upgraded to Cesium 1.8.  See the [changelog](https://github.com/AnalyticalGraphicsInc/cesium/blob/1.8/CHANGES.md) for details.
* Added support for time-dynamic WMS layers by specifying the `intervals` property.  If not specified explicitly, times are also automatically deduced from `GetCapabilities`.
* Improved the consistency and functionality of the feature information popup.
* Improved the selection indicator when selecting features by clicking them on the map.
* Made numerous improvements to the server performance check tool, accessed by appending `#tools=1` to the URL and clicking the Tools button.
* Added `preserveOrder` property to catalogue groups.  When set, the group's items will not be sorted by name.
* Added `titleField` property to WMS catalogue items to specify whether the WMS layer's title (default), name, or abstract is displayed in the catalogue.
* Clicking the clear (x) button on the search panel now returns focus to the search box.
* The Maps panel no longer prevents attempts to interact with the map.
* Very long labels in the Data Catalogue and Now Viewing tabs are now handled more gracefully.
* The input box on the Search tab no longer scrolls along with the search results.
* Added `ignoreUnknownTileErrors` property to `WebMapServiceCatalogItem` to facilitate working with badly-behaved WMS servers.
* Added `itemProperties` property to `WebMapServiceCatalogGroup` to specify additional properties to apply to the catalog items created by querying `GetCapabilities`.
* Fixed a bug that prevented WFS datasets from working in Internet Explorer 10 and Safari.

### 2015-03-26

* Greatly enhanced support for ArcGIS servers.  ArcGIS map servers can now be queried for their list of layers to populate the Data Catalogue, and they can provide metadata information when clicking a feature on the map.
* Added features to the Tools panel (accessible by visiting http://nationalmap.nicta.com.au/#tools=1) to test datasets.
* Added the "Broadband ADSL Availability" and "Broadband ADSL Availability no Borders" datasets to the catalogue under Communications.  Also fixed a typo in the name of "Broadband Availability no Borders".
* Improved styling of feature information popup in 2D viewer.
* Fixed a bug that prevented KMZ files from loading.
* Pressing Reset View now zooms back to see all of Australia even when the application is launched with a share link with another view.
* Fixed a bug that caused the view to be tilted slightly away from North after clicking the Reset View button.
* Made the 2D and 3D viewers use the exact same tile URLs, to improve caching.
* Many styling improvements / refinements.
* Fixed a bug that could cause very high memory usage when accessing a WMS server with very long strings in its metadata.
* Made National Map work even when it is not hosted at the root of the web server.

### 2015-03-03

* Add a prototype of loading KML files from data.gov.au, accessible at http://nationalmap.nicta.com.au/#dgakml.
* Improve the accuracy of picking features from WMS layers in the 3D view.
* Support picking of vector features (from GeoJSON, KML, CZML, etc.) in the 2D view even when a raster dataset (WMS, etc.) is also visible.
* Fix a bug that prevented most of the base maps from working in the 2D view.
* Fix a bug that sometimes caused high CPU usage in the 3D view.
* Dataset descriptions may now include embedded images using Markdown syntax.
* Ensure the 3D globe repaints when finished loading datasets from some sources, such GeoJSON, CZML, and WFS.
* Add support for displaying feature information from WFS and WMS servers that support GML but not GeoJSON.
* Fix a bug preventing vector polygons from GeoJSON, CZML, etc. from appearing in the 2D view.
* Fix a bug that prevented time-varying polylines from updating in the 2D view after they were initially displayed.

### 2015-02-17

#### New features, major improvements, and Catalogue changes:
* Promote data.gov.au to a top-level group and organize its datasets by Organization.
* Add the new GA topographic basemap as an option to the Maps panel.
* Add Tasmanian Government as a top-level group.
* Add a Tools panel, accessible from the menu bar when visiting http://nationalmap.nicta.com.au/#tools=1.  These tools aren't intended for use by end users.
* Fix the Population Estimates dataset.  We were pointing to a server that had been retired.
* Hide the following datasets in the "Water (Bureau of Meteorology Geofabric)" group due to poor performance: Groundwater Cartography 2.1, Surface Cartography, Surface Network 2.1.
* Add Mobile Black Spot dataset.

#### Bug fixes:
* Fix a bug where Cesium would sometimes not update when zooming in using two-finger scrolling on a touchpad.
* Fix a bug where Cesium would sometimes not update when using animation/timeline controls.
* Fix a hang when shift-drag zooming and releasing shift before releasing the mouse button.
* Fix a bug that prevented CSVs from being added to the map by URL.  Drag/drop and file selection worked fine.
* Make a region-mapped CSVs file a reorderable layer in the Now Viewing panel.
* Fix a bug that caused region-mapped layers to disappear when switching from 3D to 2D.

#### Minor changes / tweaks:
* Improve performance of the Broadband layers by leveraging the GeoWebCache and avoiding requests for non-cacheable tiles outside the region covered by the data.
* Remove the drop shadow around the compass to match the flat appearance of the rest of the UI.
* Make logos in the top-left ("brand bar") clickable.
* Re-add placeholder text ("Search address, landmark, or data set") to the Search tab input box.
* Make previously invalid URLs like http://nationalmap.nicta.com.au/#vic/ work
* Improve performance (especially in Safari) by only updating the distance / scale legend once every 250ms rather than continuously.
* Automatically switch to 2D, without losing any data, in the event of an unexpected error during 3D rendering.
* If not specified in the catalogue file, the spatial extent of a WMS layer is now automatically determined from the server's GetCapabilities.
* Update to Cesium 1.6 (changelog: https://github.com/AnalyticalGraphicsInc/cesium/blob/1.6/CHANGES.md )
* Access data.gov.au and ga.gov.au via the caching proxy for better performance.
* Improve the computation of the visible extent in 3D view, making the view stay more consistent when switching between 2D and 3D view.
* Improve the accuracy of the shared 3D view by adding precise camera parameters to the URL.
* Improve the performance of rendering point features, especially in 2D.
