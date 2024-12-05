import globeGif from "./lib/Styles/globe.gif";
import polyfill from "terriajs/lib/Core/polyfill";
import "./lib/Styles/loader.css";

async function loadMainScript() {
  return import("terriajs/lib/Core/prerequisites")
    .then(() => import("./index"))
    .then(({ default: terriaPromise }) => terriaPromise);
}

function createLoader() {
  const loaderDiv = document.createElement("div");
  loaderDiv.classList.add("loader-ui");
  const loaderGif = document.createElement("img");
  loaderGif.src = globeGif;
  const loaderLeft = document.createElement("div");
  loaderLeft.classList.add("loader-ui-left");
  const loaderGrabber = document.createElement("div");
  loaderGrabber.classList.add("loader-ui-grabber");
  const loaderRight = document.createElement("div");
  loaderRight.classList.add("loader-ui-right");
  loaderRight.appendChild(loaderGif);

  loaderDiv.appendChild(loaderLeft);
  loaderDiv.appendChild(loaderRight);
  loaderDiv.appendChild(loaderGrabber);
  loaderDiv.style.backgroundColor = "#383F4D";
  document.body.appendChild(loaderDiv);

  polyfill(function () {
    loadMainScript()
      .catch((err) => {
        // Ignore errors and try to show the map anyway
      })
      .then(() => {
        loaderDiv.classList.add("loader-ui-hide");
        setTimeout(() => {
          document.body.removeChild(loaderDiv);
        }, 2000);
      });
  });
}

createLoader();
