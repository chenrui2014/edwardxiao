import config from '../../config/config.js';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import CDN from './cdn';

let manifest = {};
let vendorManifest = {};
let manifestPath = path.resolve(__dirname, '../', '../', 'public', 'assets', 'rev-manifest.json');
let vendorManifestPath = path.resolve(__dirname, '../', '../', 'public', 'assets', 'manifest_vendor.json');
if (fs.existsSync(manifestPath)) {
  manifest = require('../../public/assets/rev-manifest.json');
  vendorManifest = require('../../public/assets/manifest_vendor.json');
}

function getAssetName(asset) {
  return manifest[asset];
}

exports.assetUrl = (assetsName) => {
  console.log(assetsName);
  const publicAsset = getAssetName(assetsName);
  console.log(publicAsset);
  if (!publicAsset) {
    assetsName = vendorManifest[assetsName];
    return `http://${CDN.URL}/assets/${assetsName}`;
  }
  else{
    return `http://${CDN.URL}/assets/${publicAsset}`;
  }
  return publicAsset;
};

// exports.assetUrl = function (asset) {
//   const publicAsset = manifest[asset];
//   let url = null;
//   if(publicAsset === undefined) {
//     url = config.assetHost + '/' + asset;
//   }
//   else {
//     url = config.assetHost + '/assets/' + publicAsset;
//   }
//   return url;
// };

// exports.vendorAssetUrl = function (asset) {
//   const publicAsset = vendorManifest[asset];
//   let url = null;
//   if(publicAsset === undefined) {
//     url = config.assetHost + '/' + asset;
//   }
//   else {
//     url = config.assetHost + '/assets/' + publicAsset;
//   }
//   return url;
// };

exports.isActive = function (action, param) {
  let active = '';
  if(action == param){
    active = 'active';
  }
  return active;
};

// moment.locale('zh-cn')

exports.timeAgo = function (date) {
  date = moment(date);
  return date.fromNow();
};

exports.formatDate = function (date) {
  date = moment(date);
  return date.format('YYYY-MM-DD HH:mm');
};
