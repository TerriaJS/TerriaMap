/*eslint-env node*/
/*eslint no-sync: 0*/
/*eslint no-process-exit: 0*/

"use strict";

/*global require*/
// Every module required-in here must be a `dependency` in package.json, not just a `devDependency`,
// This matters if ever we have gulp tasks run from npm, especially post-install ones.
var fs = require("fs");
var gulp = require("gulp");
var path = require("path");
var PluginError = require("plugin-error");
var minimist = require("minimist");

var knownOptions = {
  string: ["baseHref"],
  default: { baseHref: "/" }
};

var options = minimist(process.argv.slice(2), knownOptions);

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

  // Get a version string from "git describe".
  var version = spawnSync("git", ["describe"]).stdout.toString().trim();
  var isClean =
    spawnSync("git", ["status", "--porcelain"]).stdout.toString().length === 0;
  if (!isClean) {
    version += " (plus local modifications)";
  }

  fs.writeFileSync("version.js", "module.exports = '" + version + "';");

  done();
});

gulp.task("render-index", function renderIndex(done) {
  var ejs = require("ejs");

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

gulp.task("build", gulp.series("copy-terriajs-assets", "build-app"));
gulp.task("release", gulp.series("copy-terriajs-assets", "release-app"));
gulp.task("watch", gulp.parallel("watch-terriajs-assets", "watch-app"));
gulp.task("default", gulp.series("lint", "build"));
