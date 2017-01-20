const base = require('./base.js');
const _ = require('lodash');
const webpack = require('webpack');
const PATH = require('./build_path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = _.merge(base, {
  debug: true,
  outputPathinfo: true,
  displayErrorDetails: true,
  devtool: 'cheap-module-eval-source-map',
  output: {
    publicPath: '/assets/'
  },
  devServer: {
    historyApiFallback: true
  }
});

config.plugins.push(
  new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
  new ExtractTextPlugin('css/[name].css', {
    allChunks: true
  })
);

module.exports = config;