const defined = require('terriajs-cesium/Source/Core/defined');
const deprecationWarning = require('terriajs-cesium/Source/Core/deprecationWarning');
const Promise = require('terriajs/lib/Core/Promise');

function loadMainScript(loaderDiv) {
  //polyfill promoise since require.ensure relies on Promise
  if (!defined(window.Promise)) {
      deprecationWarning('promise-polyfill', 'This browser does not have Promise support. It will be polyfilled automatically, but an external polyfill (e.g. polyfill.io) will be required starting in TerriaJS v7.0');
      window.Promise = Promise;
  }
  // load the main chunk
  require.ensure(['./index'], function(require){
    require('./index');
    loaderDiv.classList.add('loader-ui-hide');
  }); 
}

function createLoader(){
  const loaderDiv = document.createElement('div');
  loaderDiv.classList.add("loader-ui");
  const loaderGif = document.createElement('img');
  loaderGif.src = 'images/globe.gif';
  const loaderLeft = document.createElement('div');
  loaderLeft.classList.add("loader-ui-left");
  const loaderGrabber = document.createElement('div');
  loaderGrabber.classList.add('loader-ui-grabber');
  const loaderRight = document.createElement('div');
  loaderRight.classList.add("loader-ui-right");
  loaderRight.append(loaderGif);


  loaderDiv.append(loaderLeft);
  loaderDiv.append(loaderRight);
  loaderDiv.append(loaderGrabber);
  loaderDiv.style.backgroundColor ='#383F4D';
  document.body.appendChild(loaderDiv);

  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', 'loader.css');
  document.getElementsByTagName('head')[0].appendChild(link);

  loadMainScript(loaderDiv);
}

createLoader();


