'use strict';

/*global require*/
var configureWebpackForTerriaJS = require('terriajs/buildprocess/configureWebpack');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var path = require('path');

module.exports = function(devMode, hot) {
    var config = {
        mode: devMode ? 'development' : 'production',
        entry: './entry.js',
        output: {
            path: path.resolve(__dirname, '..', 'wwwroot', 'build'),
            filename: 'TerriaMap.js',
            // work around chrome needing the full URL when using sourcemaps (http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809)
            publicPath: hot ? 'http://localhost:3003/build/' : 'build/',
            sourcePrefix: '', // to avoid breaking multi-line string literals by inserting extra tabs.
            globalObject: '(self || window)' // to avoid breaking in web worker (https://github.com/webpack/webpack/issues/6642)
        },
        devtool: devMode ? 'eval-cheap-module-source-map' : 'source-map',
        module: {
            rules: [
                {
                    test: /\.html$/,
                    include: path.resolve(__dirname, '..', 'lib', 'Views'),
                    loader: 'raw-loader'
                },
                {
                    test: /\.(ts|js)x?$/,
                    include: [
                        path.resolve(__dirname, '..', 'index.js'),
                        path.resolve(__dirname, '..', 'entry.js'),
                        path.resolve(__dirname, '..', 'lib')
                    ],
                    use: [
                        {
                            // Replace Babel's super.property getter with one that is MobX aware.
                            loader: require.resolve('string-replace-loader'),
                            options: {
                                search: 'function _get\\(target, property, receiver\\).*',
                                replace: 'var _get = require(\'terriajs/lib/Core/superGet\').default;',
                                flags: 'g'
                            }
                        },
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                presets: [
                                  [
                                    '@babel/preset-env',
                                    {
                                      corejs: 3,
                                      useBuiltIns: "usage"
                                    }
                                  ],
                                  '@babel/preset-react',
                                  ['@babel/typescript', {allowNamespaces: true}]
                                ],
                                plugins: [
                                    'babel-plugin-jsx-control-statements',
                                    '@babel/plugin-transform-modules-commonjs',
                                    ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                    '@babel/proposal-class-properties',
                                    '@babel/proposal-object-rest-spread',
                                    'babel-plugin-styled-components',
                                    require.resolve('@babel/plugin-syntax-dynamic-import')
                                ]
                            }
                        },
                        // Re-enable this if we need to observe any differences in the
                        // transpilation via ts-loader, & babel's stripping of types,
                        // or if TypeScript has newer features that babel hasn't
                        // caught up with
                        // {
                        //     loader: require.resolve('ts-loader'),
                        //     options: {
                        //          transpileOnly: true
                        //         // configFile: path.resolve(__dirname, '..', 'node_modules', 'terriajs', 'tsconfig.json')
                        //     }
                        // }
                    ]
                },
                {
                    test: /\.(png|jpg|svg|gif)$/,
                    include: path.resolve(__dirname, '..', 'wwwroot', 'images'),
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                },
                {
                    test: /globe\.gif$/,
                    include: path.resolve(__dirname, '..', 'lib', 'Styles'),
                    loader: 'url-loader',
                    options: {
                        limit: 65536
                    }
                },
                {
                    test: /loader\.css$/,
                    include: [path.resolve(__dirname, '..', 'lib', 'Styles')],
                    loader: ['style-loader', 'css-loader']
                },
                {
                    test: /\.scss$/,
                    include: [path.resolve(__dirname, '..', 'lib')],
                    loader: hot ? [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                modules: true,
                                camelCase: true,
                                localIdentName: 'tm-[name]__[local]',
                                importLoaders: 2
                            }
                        },
                        {                                                                                                                                                                                                                                                                                           
                            loader: 'resolve-url-loader',                                                                                                                                                                                                                                                             
                            options: {                                                                                                                                                                                                                                                                                
                                sourceMap: false                                                                                                                                                                                                                                                                        
                            }                                                                                                                                                                                                                                                                                         
                        },
                        'sass-loader?sourceMap'
                    ] : [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                modules: true,
                                camelCase: true,
                                localIdentName: 'tm-[name]__[local]',
                                importLoaders: 2
                            }
                        },
                        {                                                                                                                                                                                                                                                                                           
                            loader: 'resolve-url-loader',                                                                                                                                                                                                                                                             
                            options: {                                                                                                                                                                                                                                                                                
                                sourceMap: false                                                                                                                                                                                                                                                                        
                            }                                                                                                                                                                                                                                                                                         
                        },
                        'sass-loader?sourceMap'
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({filename: "TerriaMap.css", disable: hot, ignoreOrder: true, allChunks: true})
        ],
       resolve: {
            alias: {},
            modules: ['node_modules']
        }
    };
    config.resolve.alias['terriajs-variables'] = require.resolve('../lib/Styles/variables.scss');
    return configureWebpackForTerriaJS(path.dirname(require.resolve('terriajs/package.json')), config, devMode, hot, MiniCssExtractPlugin);
};
