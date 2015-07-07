Change Log
==========

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
