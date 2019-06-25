const globeGif = require('./lib/Styles/globe.gif');
require('./lib/Styles/loader.css');

function loadMainScript() {
    // load the main chunk
    return new Promise((resolve, reject) => {
        require.ensure(['./index'], function(require) {
            resolve(require('./index'));
        }, function(error) {
            reject(error);
        }, 'index'); 
    });
}

function createLoader() {
    // We only want this briefly so the explorer-window modal can be displayed
    // until we load in other modal-like-things like disclaimer windows,
    // but also other notification windows like error messages
    // So, reset it back to app defaults after
    const catalogzIndexOverride = document.createElement('style');
    catalogzIndexOverride.setAttribute('type', 'text/css');
    catalogzIndexOverride.innerHTML = `
        .tjs-explorer-window__modal-wrapper {
            z-index:10000 !important;
        }
    `;
    document.body.appendChild(catalogzIndexOverride);

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
    loaderRight.append(loaderGif);

    loaderDiv.append(loaderLeft);
    loaderDiv.append(loaderRight);
    loaderDiv.append(loaderGrabber);
    loaderDiv.style.backgroundColor ='#383F4D';
    document.body.appendChild(loaderDiv);

    loadMainScript().catch(() => {
        // Ignore errors and try to show the map anyway
    }).then(() => {
        const removeLoaderElements = () => {
            document.body.removeChild(loaderDiv);
            document.body.removeChild(catalogzIndexOverride);
        };
        loaderDiv.classList.add('loader-ui-hide');
        setTimeout(() => document.body.removeChild(catalogzIndexOverride), 300);
        loaderDiv.addEventListener('transitionend', removeLoaderElements);
        // also fallback with setTimeout here
        // so we can remove the elements anyway in case of transitionend event failure
        setTimeout(removeLoaderElements, 2000);
    });
}

createLoader();


