"use strict";

/*global require*/

var fs = require('fs');
var spawnSync = require('spawn-sync');
var glob = require('glob-all');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var exorcist = require('exorcist');
var buffer = require('vinyl-buffer');
var transform = require('vinyl-transform');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var NpmImportPlugin = require('less-plugin-npm-import');
var jsoncombine = require('gulp-jsoncombine');
var generateSchema = require('generate-terriajs-schema');
var validateSchema = require('terriajs-schema');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

var appJSName = 'nationalmap.js';
var appCssName = 'nationalmap.css';
var specJSName = 'nationalmap-tests.js';
var appEntryJSName = './index.js';
var terriaJSSource = 'node_modules/terriajs/wwwroot';
var terriaJSDest = 'wwwroot/build/TerriaJS';
var testGlob = './test/**/*.js';

var watching = false; // if we're in watch mode, we try to never quit.

gulp.task('build-app', ['prepare-terriajs'], function(done) {
    var wp = webpack(webpackConfig);
    wp.run(function(err, stats) {
        if (stats) {
            console.log(stats.toString({
                colors: true,
                modules: false,
                chunkModules: false
            }));
        }
        done(err);
    });
});

gulp.task('build-css', function() {
    return gulp.src('./index.less')
        .on('error', onError)
        .pipe(less({
            plugins: [
                new NpmImportPlugin()
            ]
        }))
        .pipe(rename(appCssName))
        .pipe(gulp.dest('./wwwroot/build/'));
});

gulp.task('build', ['build-css', 'merge-datasources', 'build-app']);

gulp.task('release-app', ['prepare'], function() {
    return build(appJSName, appEntryJSName, true);
});

// Generate new schema for editor, and copy it over whatever version came with editor.
gulp.task('make-editor-schema', ['copy-editor'], function(done) {
    generateSchema({
        source: 'node_modules/terriajs',
        dest: 'wwwroot/editor',
        noversionsubdir: true,
        editor: true,
        quiet: true
    }).then(done);
});

gulp.task('copy-editor', function() {
    return gulp.src('./node_modules/terriajs-catalog-editor/**')
        .pipe(gulp.dest('./wwwroot/editor'));
});

gulp.task('release', ['build-css', 'merge-datasources', 'release-app', 'make-editor-schema', 'validate']);

// Generate new schema for validator, and copy it over whatever version came with validator.
gulp.task('make-validator-schema', function(done) {
    generateSchema({
        source: 'node_modules/terriajs',
        dest: 'node_modules/terriajs-schema/schema',
        quiet: true
    }).then(done);
});

gulp.task('validate', ['merge-datasources', 'make-validator-schema'], function() {
    return validateSchema({
        terriajsdir: 'node_modules/terriajs',
        _: glob.sync(['datasources/00_National_Data_Sets/*.json','datasources/*.json', '!datasources/00_National_Data_Sets.json', 'wwwroot/init/*.json', '!wwwroot/init/nm.json'])
    }).then(function(result) {
        if (result && !watching) {
            // We should abort here. But currently we can't resolve the situation where a data source legitimately
            // uses some new feature not present in the latest published TerriaJS.
            //process.exit(result);
        }
    });
});

gulp.task('watch-app', ['prepare'], function(done) {
    var wp = webpack(webpackConfig);
    wp.watch({}, function(err, stats) {
        if (stats) {
            console.log(stats.toString({
                colors: true,
                modules: false,
                chunkModules: false
            }));
        }
    });
});

gulp.task('watch-css', ['build-css'], function() {
    return gulp.watch(['./index.less', './node_modules/terriajs/lib/Styles/*.less', './lib/Styles/*.less'], ['build-css']);
});

gulp.task('watch-datasource-groups', ['merge-groups'], function() {
    return gulp.watch('datasources/00_National_Data_Sets/*.json', [ 'merge-groups', 'merge-catalog' ]);
});

gulp.task('watch-datasource-catalog', ['merge-catalog'], function() {
    return gulp.watch('datasources/*.json', [ 'merge-catalog' ]);
});

gulp.task('watch-datasources', ['watch-datasource-groups','watch-datasource-catalog']);

gulp.task('watch-terriajs', ['prepare-terriajs'], function() {
    return gulp.watch(terriaJSSource + '/**', [ 'prepare-terriajs' ]);
});

gulp.task('watch', ['watch-app', 'watch-css', 'watch-datasources', 'watch-terriajs']);

gulp.task('lint', function(){
    return gulp.src(['index.js'])
        .on('error', onError)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('prepare', ['prepare-terriajs']);

gulp.task('prepare-terriajs', function() {
    return gulp
        .src([ terriaJSSource + '/**' ], { base: terriaJSSource })
        .pipe(gulp.dest(terriaJSDest));
});

gulp.task('merge-groups', function() {
    var jsonspacing=0;
    return gulp.src("./datasources/00_National_Data_Sets/*.json")
    .on('error', onError)
    .pipe(jsoncombine("00_National_Data_Sets.json", function(data) {
        // be absolutely sure we have the files in alphabetical order
        var keys = Object.keys(data).slice().sort();
        for (var i = 1; i < keys.length; i++) {
            data[keys[0]].catalog[0].items.push(data[keys[i]].catalog[0].items[0]);
        }
        return new Buffer(JSON.stringify(data[keys[0]], null, jsonspacing));
    }))
    .pipe(gulp.dest("./datasources"));
});

gulp.task('merge-catalog', ['merge-groups'], function() {
    var jsonspacing=0;
    return gulp.src("./datasources/*.json")
        .on('error', onError)
        .pipe(jsoncombine("nm.json", function(data) {
        // be absolutely sure we have the files in alphabetical order, with 000_settings first.
        var keys = Object.keys(data).slice().sort();
        data[keys[0]].catalog = [];

        for (var i = 1; i < keys.length; i++) {
            data[keys[0]].catalog.push(data[keys[i]].catalog[0]);
        }
        return new Buffer(JSON.stringify(data[keys[0]], null, jsonspacing));
    }))
    .pipe(gulp.dest("./wwwroot/init"));
});

gulp.task('merge-datasources', ['merge-catalog', 'merge-groups']);

gulp.task('default', ['lint', 'build']);

function onError(e) {
    if (e.code === 'EMFILE') {
        console.error('Too many open files. You should run this command:\n    ulimit -n 2048');
        process.exit(1);
    } else if (e.code === 'ENOSPC') {
        console.error('Too many files to watch. You should run this command:\n' +
                    '    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p');
        process.exit(1);
    }
    gutil.log(e.message);
    if (!watching) {
        process.exit(1);
    }
}
