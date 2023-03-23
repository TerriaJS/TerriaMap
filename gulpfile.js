/*eslint-env node*/
/*eslint no-sync: 0*/
/*eslint no-process-exit: 0*/

"use strict";

/*global require*/
// If gulp tasks are run in a post-install task modules required here must be be a `dependency`
//  in package.json, not just a `devDependency`. This is not currently needed.
var fs = require("fs");
var gulp = require("gulp");
var path = require("path");
var PluginError = require("plugin-error");

var watchOptions = {
  interval: 1000
};

gulp.task("check-terriajs-dependencies", function (done) {
  var appPackageJson = require("./package.json");
  var terriaPackageJson = require("terriajs/package.json");

  syncDependencies(appPackageJson.dependencies, terriaPackageJson, true);
  syncDependencies(appPackageJson.devDependencies, terriaPackageJson, true);
  done();
});

gulp.task("write-version", function (done) {
  var fs = require("fs");
  var spawnSync = require("child_process").spawnSync;

  const nowDate = new Date();
  const dateString = `${nowDate.getFullYear()}-${
    nowDate.getMonth() + 1
  }-${nowDate.getDate()}`;
  const packageJson = require("./package.json");
  const terriajsPackageJson = require("./node_modules/terriajs/package.json");

  const isClean =
    spawnSync("git", ["status", "--porcelain"]).stdout.toString().length === 0;

  const gitHash = spawnSync("git", ["rev-parse", "--short", "HEAD"])
    .stdout.toString()
    .replace("\n", "");

  let version = `${dateString}-${packageJson.version}-${terriajsPackageJson.version}-${gitHash}`;

  if (!isClean) {
    version += " (plus local modifications)";
  }

  // Write version.js - which will be injected into `{{version}}` in Terria `brandBarElements`
  fs.writeFileSync("version.js", "module.exports = '" + version + "';");

  // Also write out a JSON file with all versions into wwwroot
  fs.writeFileSync(
    "wwwroot/version.json",
    JSON.stringify({
      date: dateString,
      terriajs: terriajsPackageJson.version,
      terriamap: packageJson.version,
      terriamapCommitHash: gitHash,
      hasLocalModifications: !isClean
    })
  );

  done();
});

gulp.task("render-index", function renderIndex(done) {
  var ejs = require("ejs");
  var minimist = require("minimist");
  // Arguments written in skewer-case can cause problems (unsure why), so stick to camelCase
  var options = minimist(process.argv.slice(2), {
    string: ["baseHref"],
    default: { baseHref: "/" }
  });

  var index = fs.readFileSync("wwwroot/index.ejs", "utf8");
  var indexResult = ejs.render(index, { baseHref: options.baseHref });

  fs.writeFileSync(path.join("wwwroot", "index.html"), indexResult);
  done();
});

gulp.task(
  "build-app",
  gulp.parallel(
    "render-index",
    gulp.series(
      "check-terriajs-dependencies",
      "write-version",
      function buildApp(done) {
        var runWebpack = require("terriajs/buildprocess/runWebpack.js");
        var webpack = require("webpack");
        var webpackConfig = require("./buildprocess/webpack.config.js")(true);

        checkForDuplicateCesium();

        runWebpack(webpack, webpackConfig, done);
      }
    )
  )
);

gulp.task(
  "release-app",
  gulp.parallel(
    "render-index",
    gulp.series(
      "check-terriajs-dependencies",
      "write-version",
      function releaseApp(done) {
        var runWebpack = require("terriajs/buildprocess/runWebpack.js");
        var webpack = require("webpack");
        var webpackConfig = require("./buildprocess/webpack.config.js")(false);

        checkForDuplicateCesium();

        runWebpack(
          webpack,
          Object.assign({}, webpackConfig, {
            plugins: webpackConfig.plugins || []
          }),
          done
        );
      }
    )
  )
);

gulp.task(
  "watch-render-index",
  gulp.series("render-index", function watchRenderIndex() {
    gulp.watch(["wwwroot/index.ejs"], gulp.series("render-index"));
  })
);

gulp.task(
  "watch-app",
  gulp.parallel(
    "watch-render-index",
    gulp.series("check-terriajs-dependencies", function watchApp(done) {
      var fs = require("fs");
      var watchWebpack = require("terriajs/buildprocess/watchWebpack");
      var webpack = require("webpack");
      var webpackConfig = require("./buildprocess/webpack.config.js")(
        true,
        false
      );

      checkForDuplicateCesium();

      fs.writeFileSync("version.js", "module.exports = 'Development Build';");
      watchWebpack(webpack, webpackConfig, done);
    })
  )
);

gulp.task("copy-terriajs-assets", function () {
  var terriaWebRoot = path.join(getPackageRoot("terriajs"), "wwwroot");
  var sourceGlob = path.join(terriaWebRoot, "**");
  var destPath = path.resolve(__dirname, "wwwroot", "build", "TerriaJS");

  return gulp
    .src([sourceGlob], { base: terriaWebRoot })
    .pipe(gulp.dest(destPath));
});

gulp.task(
  "watch-terriajs-assets",
  gulp.series("copy-terriajs-assets", function waitForTerriaJsAssetChanges() {
    var terriaWebRoot = path.join(getPackageRoot("terriajs"), "wwwroot");
    var sourceGlob = path.join(terriaWebRoot, "**");

    // gulp.watch as of gulp v4.0.0 doesn't work with backslashes (the task is never triggered).
    // But Windows is ok with forward slashes, so use those instead.
    if (path.sep === "\\") {
      sourceGlob = sourceGlob.replace(/\\/g, "/");
    }

    gulp.watch(sourceGlob, watchOptions, gulp.series("copy-terriajs-assets"));
  })
);

gulp.task("lint", function (done) {
  var runExternalModule = require("terriajs/buildprocess/runExternalModule");

  runExternalModule("eslint/bin/eslint.js", [
    "-c",
    path.join(getPackageRoot("terriajs"), ".eslintrc"),
    "--ignore-pattern",
    "lib/ThirdParty",
    "--max-warnings",
    "0",
    "index.js",
    "lib"
  ]);
  done();
});

function getPackageRoot(packageName) {
  return path.dirname(require.resolve(packageName + "/package.json"));
}

gulp.task("clean", function (done) {
  var fs = require("fs-extra");

  // // Remove build products
  fs.removeSync(path.join("wwwroot", "build"));

  done();
});

gulp.task("sync-terriajs-dependencies", function (done) {
  var appPackageJson = require("./package.json");
  var terriaPackageJson = require("terriajs/package.json");

  syncDependencies(appPackageJson.dependencies, terriaPackageJson);
  syncDependencies(appPackageJson.devDependencies, terriaPackageJson);

  fs.writeFileSync(
    "./package.json",
    JSON.stringify(appPackageJson, undefined, "  ")
  );
  console.log(
    "TerriaMap's package.json has been updated. Now run yarn install."
  );
  done();
});

function syncDependencies(dependencies, targetJson, justWarn) {
  for (var dependency in dependencies) {
    if (dependencies.hasOwnProperty(dependency)) {
      var version =
        targetJson.dependencies[dependency] ||
        targetJson.devDependencies[dependency];
      if (version && version !== dependencies[dependency]) {
        if (justWarn) {
          console.warn(
            "Warning: There is a version mismatch for " +
              dependency +
              ". This build may fail or hang. You should run `gulp sync-terriajs-dependencies`, then re-run `npm install`, then run gulp again."
          );
        } else {
          console.log(
            "Updating " +
              dependency +
              " from " +
              dependencies[dependency] +
              " to " +
              version +
              "."
          );
          dependencies[dependency] = version;
        }
      }
    }
  }
}

function checkForDuplicateCesium() {
  var fse = require("fs-extra");

  if (
    fse.existsSync("node_modules/terriajs-cesium") &&
    fse.existsSync("node_modules/terriajs/node_modules/terriajs-cesium")
  ) {
    console.log(
      "You have two copies of terriajs-cesium, one in this application's node_modules\n" +
        "directory and the other in node_modules/terriajs/node_modules/terriajs-cesium.\n" +
        "This leads to strange problems, such as knockout observables not working.\n" +
        "Please verify that node_modules/terriajs-cesium is the correct version and\n" +
        "  rm -rf node_modules/terriajs/node_modules/terriajs-cesium\n" +
        "Also consider running:\n" +
        "  yarn gulp sync-terriajs-dependencies\n" +
        "to prevent this problem from recurring the next time you `npm install`."
    );
    throw new PluginError(
      "checkForDuplicateCesium",
      "You have two copies of Cesium.",
      { showStack: false }
    );
  }
}

gulp.task("terriajs-server", function (done) {
  // E.g. gulp terriajs-server --terriajsServerArg port=4000 --terriajsServerArg verbose=true
  //  or gulp dev --terriajsServerArg port=3000
  const { spawn } = require("child_process");
  const minimist = require("minimist");
  // Arguments written in skewer-case can cause problems (unsure why), so stick to camelCase
  const options = minimist(process.argv.slice(2), {
    string: ["terriajsServerArg"],
    default: { terriajsServerArg: [] }
  });

  const logFile = fs.openSync("./terriajs-server.log", "a");
  const serverArgs = Array.isArray(options.terriajsServerArg)
    ? options.terriajsServerArg
    : [options.terriajsServerArg];
  const child = spawn(
    "node",
    [
      "./node_modules/.bin/terriajs-server",
      ...serverArgs.map((arg) => `--${arg}`)
    ],
    { detached: true, stdio: ["ignore", logFile, logFile] }
  );
  child.on("exit", (exitCode, signal) => {
    done(
      new Error(
        "terriajs-server quit" +
          (exitCode !== null ? ` with exit code: ${exitCode}` : "") +
          (signal ? ` from signal: ${signal}` : "") +
          "\nCheck terriajs-server.log for more information."
      )
    );
  });
  // Intercept SIGINT, SIGTERM and SIGHUP, cleanup terriajs-server and re-send signal
  // May fail to catch some relevant signals on Windows
  // SIGINT: ctrl+c
  // SIGTERM: kill <pid>
  // SIGHUP: terminal closed
  process.once("SIGINT", () => {
    child.kill("SIGTERM");
    process.kill(process.pid, "SIGINT");
  });
  process.once("SIGTERM", () => {
    child.kill("SIGTERM");
    process.kill(process.pid, "SIGTERM");
  });
  process.once("SIGHUP", () => {
    child.kill("SIGTERM");
    process.kill(process.pid, "SIGHUP");
  });
});

gulp.task("build", gulp.series("copy-terriajs-assets", "build-app"));
gulp.task("release", gulp.series("copy-terriajs-assets", "release-app"));
gulp.task("watch", gulp.parallel("watch-terriajs-assets", "watch-app"));
// Run render-index before starting terriajs-server because terriajs-server won't
//  start if index.html isn't present
gulp.task(
  "dev",
  gulp.parallel(gulp.series("render-index", "terriajs-server"), "watch")
);
gulp.task("default", gulp.series("lint", "build"));
