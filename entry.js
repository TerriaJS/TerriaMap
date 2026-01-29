import globeGif from "./lib/Styles/globe.gif";
import "./lib/Styles/loader.css";
import "terriajs-components/dist/styles.css";

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
  loaderDiv.appendChild(loaderGif);

  loaderDiv.style.backgroundColor = "#383F4D";
  document.body.appendChild(loaderDiv);

  loadMainScript()
    .catch((_err) => {
      // Ignore errors and try to show the map anyway
    })
    .then(() => {
      loaderDiv.classList.add("loader-ui-hide");
      setTimeout(() => {
        document.body.removeChild(loaderDiv);
      }, 2000);
    });
}

createLoader();
