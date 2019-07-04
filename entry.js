const globeGif = require('./lib/Styles/globe.gif');
const polyfill = require("terriajs/lib/Core/polyfill");

require('./lib/Styles/loader.css');

function loadMainScript() {
    // load the main chunk
    return new Promise((resolve, reject) => {
      require.ensure(['terriajs/lib/Core/prerequisites'], function(require) {
        require('terriajs/lib/Core/prerequisites');
        require.ensure(['./index'], function(require) {
          resolve(require('./index'));
        }, reject, 'index');
      }, reject, 'index');
    });
}

function createLoader() {
    const loaderDiv = document.createElement('div');
    loaderDiv.classList.add("loader-ui");
    const loaderGif = document.createElement('img');
    loaderGif.src = globeGif;
    const loaderLeft = document.createElement('div');
    loaderLeft.classList.add("loader-ui-left");
    const loaderGrabber = document.createElement('div');
    loaderGrabber.classList.add('loader-ui-grabber');
    const loaderRight = document.createElement('div');
    loaderRight.classList.add("loader-ui-right");
    loaderRight.appendChild(loaderGif);

    loaderDiv.appendChild(loaderLeft);
    loaderDiv.appendChild(loaderRight);
    loaderDiv.appendChild(loaderGrabber);
    loaderDiv.style.backgroundColor ='#383F4D';
    document.body.appendChild(loaderDiv);

    polyfill(function() {
        loadMainScript().catch(() => {
            // Ignore errors and try to show the map anyway
        }).then(() => {
            loaderDiv.classList.add('loader-ui-hide');
            setTimeout(()=> {
                document.body.removeChild(loaderDiv);
            }, 2000);
        });
    });
}

createLoader();
