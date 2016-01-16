'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: NODE_ENV == 'development' ? 'eval' : null,

  context: __dirname + '/src',
  entry: {
    app: [
      './assets/javascripts/app.js',
      './components/list/script.js',
      './components/card/script.js',
    ],
  },
  output: {
    path: __dirname + '/build/assets',
    publicPath: '/assets/',
    filename: '/javascripts/[name].js'
  },

  watch: NODE_ENV == 'development',
  watchOptions: {
    aggregateTimeout: 100
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js']
  },

  resolveLoader: {
    modulesDirectories: ['node_modules'],
    moduleTemplates: ['*-loader'],
    extensions: ['', '.js']
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /\/node_modules\//,
        loader: 'babel?presets[]=es2015﻿'
      },
      {
        test: /\.jade$/,
        loader: ExtractTextPlugin.extract("jade", "jade-html")
      },
      // {
      //   test: /\.html$/,
      //   loader: 'html'
      // },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style", "css?resolve-url!csscomb!autoprefixer?browsers=last 2 versions")
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style", "css!sass?resolve-url!csscomb!autoprefixer?browsers=last 2 versions")
      },
      {
        test: /\.(png|jpg|gif|svg|ttf|eot|woff|woff2)$/,
        loader: 'file?name=[name].[ext]'
      }
    ]
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    }),
    new ExtractTextPlugin('[name].html', { allChunks: true }),
    new ExtractTextPlugin('stylesheets/app.css', { allChunks: true, disable: process.env.NODE_ENV == 'development'}),
    // new ExtractTextPlugin('[name].[ext]', { allChunks: true, disable: process.env.NODE_ENV == 'development'}),
    // new ProvidePlugin({
    //   $: ‘jquery’,
    //   jQuery: ‘jquery’,
    //   ‘window.jQuery’: ‘jquery’,
    // }),
  ],

  devServer: {
    host: 'localhost',
    port: 8080,
    contentBase: __dirname + '/build',
  }
};

if (NODE_ENV == 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true
      }
    })
  );
}
