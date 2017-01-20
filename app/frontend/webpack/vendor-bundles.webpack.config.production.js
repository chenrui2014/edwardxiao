var webpack = require('webpack');
var ManifestPlugin = require('webpack-manifest-plugin');

var config = module.exports = require('./vendor-bundles.webpack.config.js');

config.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
  new ManifestPlugin({
    fileName: 'manifest_vendor.json'
  }),
  new webpack.DefinePlugin({
    "process.env": {
       NODE_ENV: JSON.stringify('production')
     }
  })
);

config.output['filename'] = '[name]_bundle_[chunkhash].js';