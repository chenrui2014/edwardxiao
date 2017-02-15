const base = require('./base.js');
const _ = require('lodash');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postcssImport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const postcssReporter = require("postcss-reporter");
const PATH = require('./build_path');
const ENV = require('../../../.env');

const config = _.merge({}, base);

config['debug'] = false;
config.output = _.merge(config.output, {
  publicPath: '/' + ENV.APP_NAME + '/assets/',
  filename: '[name]-[chunkhash].js'
});
config['devtool'] = 'cheap-source-map';
config.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
  new webpack.optimize.CommonsChunkPlugin('common', 'common-[hash].js'),
  new ExtractTextPlugin('css/[name]-[hash].css', {
    allChunks: true
  }),
  new webpack.DefinePlugin({
    "process.env": {
       NODE_ENV: JSON.stringify('production')
     }
  })
);

config.postcss = function(webpack) {
  return [
    postcssImport({addDependencyTo: webpack}),
    cssnext({autoprefixer: {browsers: "ie >= 9, ..."}}),
    postcssReporter({clearMessages: true})
  ]
};

module.exports = config;
