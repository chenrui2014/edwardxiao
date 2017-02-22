const webpack = require('webpack');
const path = require('path');
const PATH = require('./build_path');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');
const postcssImport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const postcssReporter = require("postcss-reporter");
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
    preLoaders: [{
      test: /\.js$/,
      loader: "eslint-loader",
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loaders: ['postcss'],
      include: PATH.ROOT_PATH + 'frontend/css'
    }],
    loaders: [{
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: ["babel-loader"],
        query: {
          presets: ["es2015"]
        }
      },
      { test: /\.modernizrrc$/, loader: 'modernizr' },
      { test: /\.xml$/, loader: 'xml-loader' }, {
        test: /\.(woff|woff2|eot|ttf|otf)\??.*$/,
        loader: 'url-loader?limit=8192&name=font/[name].[ext]'
      }, {
        test: /\.(jpe?g|png|gif|svg)\??.*$/,
        loader: 'url-loader?limit=8192&name=img/[name].[ext]'
      }, {
        test: /\.less$/,
        loader: 'style!css!less'
      }, {
        test: /\.(css|scss|sass)$/,
        loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader', 'sass-loader'])
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.coffee', '.json'],
    alias: {
      'react': 'react',
      'picker': 'pickadate/lib/picker',
      modernizr$: path.resolve(__dirname, PATH.ROOT_PATH + '.modernizrrc')
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
    new PurifyCSSPlugin({
      basePath: process.cwd()
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
  ],
  eslint: {
    configFile: '.eslintrc.json',
    failOnError: false
  },
  postcss: function(webpack) {
    return [
      postcssImport({ addDependencyTo: webpack }),
      stylelint({
        config: require(PATH.ROOT_PATH + 'stylelint.config.js'),
        failOnError: true
      }),
      // do not autoprefixer the css because of style lint in development env,
      // whereas it will be called in production env, see production.config.js

      cssnext({ autoprefixer: { browsers: "ie >= 9, ..." } }),
      postcssReporter({ clearMessages: true })
    ]
  }
};
