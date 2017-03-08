var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var WriteFilePlugin = require('write-file-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    // devtool: 'source-map', // not working
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        // Create HTML file that includes reference to bundled JS.
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            inject: true
        }),
        // select files to copy around
        new CopyWebpackPlugin([
            { context: 'src', from: 'images/**/*', to: '' },
            { context: 'src', from: '*.json', to: '' },
            { context: 'src', from: 'favicon.ico', to: '' }
            ], 
            {
                copyUnmodified: false
            }
        ),
        // copy files around
        new WriteFilePlugin(),
        // Generate an external css file with a hash in the filename (to avoid FOUC)
        new ExtractTextPlugin('[name].[contenthash].css'),
        // Minify JS
        new webpack.optimize.UglifyJsPlugin(),
        // Minify CSS
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: {removeAll: true } },
            canPrint: true
        })
    ],
    // Configuration options for the module loaders (aka babel transpiler, sass transpiler etc)
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader' // -loader suffix can no longer be omitted!
                ]
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    //resolve-url-loader may be chained before sass-loader if necessary
                    use: ['css-loader', 'postcss-loader', 'sass-loader'] // sourceMaps should work by appending "?sourceMap" but it dont
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader']
                })
            },
            {
                test: /\.(jpg|png|gif|ttf|eot|svg|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 25000
                },
            }
        ]
    }
};