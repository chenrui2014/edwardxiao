const config = require('../../config/config.js');

const APP_NAME = config['appName'];
const CDN = config.qiniu.domain;
const CDN_URL = `${CDN}/${APP_NAME}`;

const URL = CDN_URL;

module.exports = {
  URL: CDN ? URL : ''
}