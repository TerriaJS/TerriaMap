/*eslint-env node*/
/*eslint no-sync: 0*/
/*eslint no-process-exit: 0*/
/*eslint no-redeclare: 0*/
/*eslint @typescript-eslint/no-require-imports: 0*/

"use strict";

/*global require*/
var fs = require("fs");
var gulp = require("gulp");
var path = require("path");
var PluginError = require("plugin-error");
var terriajsServerGulpTask = require("terriajs/buildprocess/terriajsServerGulpTask");

const getBaseHref = () => {
  const minimist = require("minimist");
  // Arguments written in skewer-case can cause problems (unsure why), so stick to camelCase
  const options = minimist(process.argv.slice(2), {
    string: ["baseHref"],
    default: { baseHref: "/" }
  });

  return options.baseHref;
};
const viteBuildArgs = (mode) => {
  const args = ["vite", "build", "--mode", mode];
  const baseHref = getBaseHref();
  if (baseHref !== "/") {
    args.push("--base", baseHref);
  }
  return args;
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
  fs.writeFileSync("version.js", "export default '" + version + "';");

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

gulp.task(
  "build-app",
  gulp.series(
    "check-terriajs-dependencies",
    "write-version",
    function buildApp(done) {
      var spawn = require("child_process").spawn;
      var proc = spawn("npx", viteBuildArgs("development"), {
        stdio: "inherit",
        shell: true
      });
      proc.on("close", function (code) {
        if (code !== 0) {
          done(new PluginError("vite", "Build failed", { showStack: false }));
        } else {
          done();
        }
      });
    }
  )
);

gulp.task(
  "release-app",
  gulp.series(
    "check-terriajs-dependencies",
    "write-version",
    function releaseApp(done) {
      var spawn = require("child_process").spawn;
      var proc = spawn("npx", viteBuildArgs("production"), {
        stdio: "inherit",
        shell: true
      });
      proc.on("close", function (code) {
        if (code !== 0) {
          done(new PluginError("vite", "Build failed", { showStack: false }));
        } else {
          done();
        }
      });
    }
  )
);

gulp.task("lint", function (done) {
  var runExternalModule = require("terriajs/buildprocess/runExternalModule");
  const eslintDir = path.dirname(require.resolve("eslint/package.json"));
  const eslintExecutable = path.join(eslintDir, "bin", "eslint.js");
  runExternalModule(eslintExecutable, [
    "--max-warnings",
    "0",
    "index.js",
    "lib"
  ]);
  done();
});

gulp.task("clean", function (done) {
  var fs = require("fs-extra");

  // Remove build products
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
    // eslint-disable-next-line no-prototype-builtins
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

gulp.task("terriajs-server", terriajsServerGulpTask(3002));

gulp.task("build", gulp.series("build-app"));
gulp.task("release", gulp.series("release-app"));
// Vite dev server with HMR + terriajs-server as CORS proxy backend
gulp.task(
  "dev",
  gulp.parallel("terriajs-server", function startViteDev(done) {
    var spawn = require("child_process").spawn;
    var proc = spawn("npx", ["vite"], { stdio: "inherit", shell: true });
    proc.on("close", function (code) {
      if (code !== 0) {
        done(
          new PluginError("vite", "Dev server exited", { showStack: false })
        );
      } else {
        done();
      }
    });
  })
);
gulp.task("default", gulp.series("lint", "build"));
