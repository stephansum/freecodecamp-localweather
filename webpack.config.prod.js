var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var WriteFilePlugin = require('write-file-webpack-plugin');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    mode: 'production',
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
            { context: 'src', from: 'favicon.ico', to: '' }
            ], 
            {
                copyUnmodified: false
            }
        ),
        // copy files around
        new WriteFilePlugin(),
        // Generate an external css file with a hash in the filename (to avoid Flash of unstyled content (FOUC))
        new MiniCssExtractPlugin({filename: "[name]-[contenthash:8].css"}),
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
                use: [
                    MiniCssExtractPlugin.loader, // to avoid  Flash of unstyled content (FOUC)
                    { loader: 'css-loader', options: { importLoaders: 2 } },  // importLoaders allow to configure which loaders should be applied to @imported resources.  importLoaders (int): That many loaders after the css-loader are used to import resources.
                    // 'postcss-loader',
                    "sass-loader"
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    // 'postcss-loader'
            ]},
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