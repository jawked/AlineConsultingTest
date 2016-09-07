var path                = require("path");
var Webpack             = require("webpack");
var CopyWebpackPlugin   = require('copy-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        app: [
            './entry.jsx',
            'webpack-dev-server/client?http://localhost:8080/'
        ]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "app.js",
        publicPath: '/'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [

        new Webpack.optimize.OccurenceOrderPlugin(),
        new Webpack.HotModuleReplacementPlugin(),
        new Webpack.NoErrorsPlugin(),

        // Copy static files to build folder.
        new CopyWebpackPlugin([

            { from: './index.html' },

        ]),

    ],
    devServer: {
        historyApiFallback: true,
        proxy: {
            '/api/*': {
                target: 'http://localhost:8081/',
                pathRewrite: {'^/api' : ''}
            }
        }
    }
}