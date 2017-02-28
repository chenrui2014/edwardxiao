const webpack = require('webpack');
const path = require('path');
const PATH = require('./build_path');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const stylelint = require('stylelint');
const stylelintRules = require('../../../stylelint.config.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

var config = module.exports = {
  context: PATH.ROOT_PATH,
  entry: {
    base: PATH.ROOT_PATH + 'app/frontend/js/base.js',
    index: PATH.ROOT_PATH + 'app/frontend/js/index.js',
  },
  module: {
    rules: [{
      test: /\.(woff|woff2|eot|ttf|otf)\??.*$/,
      use: 'url-loader?limit=8192&name=font/[name].[ext]'
    }, {
      test: /\.(jpe?g|png|gif|svg)\??.*$/,
      use: 'url-loader?limit=8192&name=img/[name].[ext]'
    }, {
      test: /(\.css|\.scss|\.sass)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: function(webpack) {
              return [
                stylelint({
                  config: stylelintRules,
                  failOnError: true
                }),
                require('autoprefixer'),
              ];
            }
          }
        }, {
          loader: 'sass-loader',
          options: {}
        }]
      })
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      'react': 'react',
      'picker': 'pickadate/lib/picker',
    }
  },
  output: {
    path: PATH.ASSET_PATH,
    filename: 'js/[name].js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.DllReferencePlugin({
      context: PATH.ROOT_PATH,
      manifest: require(path.join(PATH.ASSET_PATH, './react_vendors-manifest.json'))
    }),
    new ManifestPlugin({
      fileName: 'rev-manifest.json'
    }),
    new CopyWebpackPlugin([
      { from: PATH.ROOT_PATH + 'app/frontend/static/', to: PATH.ROOT_PATH + 'public/assets/static/' },
    ])
  ]
};
