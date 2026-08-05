import globeGif from "../Styles/globe.gif";
import Styles from "./loader.scss";

const loadingStr = "Loading the globe";

export const Loader = () => {
  return (
    <div
      className={Styles.loaderUi}
      style={{
        backgroundColor: "#383F4D"
      }}
    >
      <div className={Styles.loaderUiContainer}>
        <img src={globeGif} />
        <div className={Styles.loaderUiText}>{loadingStr}</div>
      </div>
    </div>
  );
};
