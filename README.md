[![Build Status](https://travis-ci.org/NICTA/nationalmap.svg?branch=master)](https://travis-ci.org/TerriaJS/map)

Terria Map
==========
![Terria logo](terria-logo.png "Terria logo")

Thanks for trying out Terria Map, the software that drives [http://nationalmap.gov.au](National Map), [nationalmap.gov.au/renewables](AREMI), [NEII Viewer](neiiviewer.nicta.com.au) and other map-based sites that let you explore a range of datasets. If you want to make your own site like those, this is the place to start.

### Getting Started ###
 Pre-requisites: Git, NodeJS, NPM, GDAL (optional). (See the wiki for details)
 
 ```
 sudo npm install -g gulp                     # Install gulp, the build tool
 git clone https://github.com/TerriaJS/Map    # Get the code
 cd Map                                       
 npm install                                  # Install dependencies
 npm start                                    # Start the server in the background
 gulp watch                                   # Build the site, and watch for changes.
 ```

 Now visit the site in your browser at `http://localhost:3001`.
 
 See the [wiki](https://github.com/NICTA/nationalmap/wiki) for more detailed information about how to build and run it.
