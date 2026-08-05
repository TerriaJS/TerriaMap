declare namespace LoaderScssNamespace {
  export interface ILoaderScss {
    "loader-ui": string;
    "loader-ui-container": string;
    "loader-ui-hide": string;
    "loader-ui-text": string;
    loaderUi: string;
    loaderUiContainer: string;
    loaderUiHide: string;
    loaderUiText: string;
  }
}

declare const LoaderScssModule: LoaderScssNamespace.ILoaderScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: LoaderScssNamespace.ILoaderScss;
};

export = LoaderScssModule;
