import TerriaError from "terriajs/lib/Core/TerriaError";
import * as Sentry from "@sentry/react";
import { ErrorServiceProvider } from "terriajs/lib/Models/ErrorServiceProviders/ErrorService";
import { ConfigParameters } from "terriajs/lib/Models/Terria";

export default class SentryErrorServiceProvider
  implements ErrorServiceProvider
{
  init(config: ConfigParameters) {
    Sentry.init({
      ...config.errorService?.configuration
    });
    console.log("sentry init");
  }

  error(_error: string | Error | TerriaError) {
    console.log("sentry err");
    if (_error instanceof TerriaError) {
      Sentry.captureException(_error.toError());
    } else {
      Sentry.captureException(_error);
    }
  }
}
