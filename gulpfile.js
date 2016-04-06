'use strict';

/*global require*/
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');

gulp.task('build', ['build-css', 'merge-datasources', 'copy-terriajs-assets', 'build-app']);
gulp.task('release', ['build-css', 'merge-datasources', 'copy-terriajs-assets', 'release-app', 'make-editor-schema', 'validate']);
gulp.task('watch', ['watch-css', 'watch-datasources', 'watch-terriajs-assets', 'watch-app']);
gulp.task('merge-datasources', ['merge-catalog', 'merge-groups']);
gulp.task('default', ['lint', 'build']);

gulp.task('build-app', function(done) {
    var runWebpack = require('terriajs/buildprocess/runWebpack.js');
    var webpackConfig = require('./buildprocess/webpack.config.js');

    runWebpack(webpackConfig, done);
});

gulp.task('release-app', function(done) {
    var runWebpack = require('terriajs/buildprocess/runWebpack.js');
    var webpack = require('webpack');
    var webpackConfig = require('./buildprocess/webpack.config.js');

    runWebpack(Object.assign({}, webpackConfig, {
        devtool: 'source-map',
        plugins: [
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurrenceOrderPlugin()
        ].concat(webpackConfig.plugins || [])
    }), done);
});

gulp.task('watch-app', function(done) {
    var watchWebpack = require('terriajs/buildprocess/watchWebpack');
    var webpackConfig = require('./buildprocess/webpack.config.js');

    watchWebpack(webpackConfig, done);
});

gulp.task('build-css', function() {
    var less = require('gulp-less');
    var NpmImportPlugin = require('less-plugin-npm-import');
    var rename = require('gulp-rename');

    return gulp.src('./index.less')
        .on('error', onError)
        .pipe(less({
            plugins: [
                new NpmImportPlugin()
            ]
        }))
        .pipe(rename('nationalmap.css'))
        .pipe(gulp.dest('./wwwroot/build/'));
});

gulp.task('watch-css', ['build-css'], function() {
    var terriaStylesGlob = path.join(getPackageRoot('terriajs'), 'lib', 'Styles', '**', '*.less');
    var appStylesGlob = path.join(__dirname, 'lib', 'Styles', '**', '*.less');
    return gulp.watch(['./index.less', terriaStylesGlob, appStylesGlob], ['build-css']);
});

gulp.task('copy-terriajs-assets', function() {
    var terriaWebRoot = path.join(getPackageRoot('terriajs'), 'wwwroot');
    var sourceGlob = path.join(terriaWebRoot, '**');
    var destPath = path.resolve(__dirname, 'wwwroot', 'build', 'TerriaJS');

    return gulp
        .src([ sourceGlob ], { base: terriaWebRoot })
        .pipe(gulp.dest(destPath));
});

gulp.task('watch-terriajs-assets', ['copy-terriajs-assets'], function() {
    var terriaWebRoot = path.join(getPackageRoot('terriajs'), 'wwwroot');
    var sourceGlob = path.join(terriaWebRoot, '**');

    return gulp.watch(sourceGlob, [ 'copy-terriajs-assets' ]);
});

// Generate new schema for editor, and copy it over whatever version came with editor.
gulp.task('make-editor-schema', ['copy-editor'], function() {
    var generateSchema = require('generate-terriajs-schema');

    return generateSchema({
        source: getPackageRoot('terriajs'),
        dest: 'wwwroot/editor',
        noversionsubdir: true,
        editor: true,
        quiet: true
    });
});

gulp.task('copy-editor', function() {
    var glob = path.join(getPackageRoot('terriajs-catalog-editor'), '**');

    return gulp.src(glob)
        .pipe(gulp.dest('./wwwroot/editor'));
});

// Generate new schema for validator, and copy it over whatever version came with validator.
gulp.task('make-validator-schema', function() {
    var generateSchema = require('generate-terriajs-schema');

    return generateSchema({
        source: getPackageRoot('terriajs'),
        dest: path.join(getPackageRoot('terriajs-schema'), 'schema'),
        quiet: true
    });
});

gulp.task('validate', ['merge-datasources', 'make-validator-schema'], function() {
    var glob = require('glob-all');
    var validateSchema = require('terriajs-schema');

    return validateSchema({
        terriajsdir: 'node_modules/terriajs',
        _: glob.sync(['datasources/00_National_Data_Sets/*.json','datasources/*.json', '!datasources/00_National_Data_Sets.json', 'wwwroot/init/*.json', '!wwwroot/init/nm.json'])
    }).then(function(result) {
        if (result) {
            // We should abort here. But currently we can't resolve the situation where a data source legitimately
            // uses some new feature not present in the latest published TerriaJS.
            //process.exit(result);
        }
    });
});

gulp.task('watch-datasource-groups', ['merge-groups'], function() {
    return gulp.watch('datasources/00_National_Data_Sets/*.json', [ 'merge-groups', 'merge-catalog' ]);
});

gulp.task('watch-datasource-catalog', ['merge-catalog'], function() {
    return gulp.watch('datasources/*.json', [ 'merge-catalog' ]);
});

gulp.task('watch-datasources', ['watch-datasource-groups','watch-datasource-catalog']);

gulp.task('lint', function() {
    var runExternalModule = require('terriajs/buildprocess/runExternalModule');

    runExternalModule('eslint/bin/eslint.js', [
        '-c', path.join(getPackageRoot('terriajs'), '.eslintrc'),
        '--ignore-pattern', 'lib/ThirdParty',
        '--max-warnings', '0',
        'index.js',
        'lib'
    ]);
});

gulp.task('merge-groups', function() {
    var jsoncombine = require('gulp-jsoncombine');

    var jsonspacing = 0;
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
    var jsoncombine = require('gulp-jsoncombine');

    var jsonspacing = 0;
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
    process.exit(1);
}

function getPackageRoot(packageName) {
    return path.dirname(require.resolve(packageName + '/package.json'));
}
