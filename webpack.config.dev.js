var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    devtool: 'inline-source-map',
    output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        // Create HTML file that includes reference to bundled JS.
        new HtmlWebpackPlugin({
            template: 'src/index.html',
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
        new WriteFilePlugin()
    ],
    // Configuration options for the module loaders (aka babel transpiler, sass transpiler etc)
    module: {
        rules: [
            {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
                'babel-loader' // -loader suffix can no longer be omitted!
            ]},
            {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'postcss-loader',
                'sass-loader'
            ]},
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
            ]},
            {
                test: /\.(jpg|png|gif|ttf|eot|svg|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 25000
                },
            }
        ]
    },
    // Configuration options for the webpack-dev-server
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 3000
    }
};