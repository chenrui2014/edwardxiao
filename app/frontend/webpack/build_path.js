const path = require('path');

const CURRENT_PATH = path.resolve(__dirname);
const ROOT_PATH = path.join(__dirname, '../', '../', '../');
const PUBLIC_PATH = path.resolve(__dirname, '../', '../', '../', 'public/assets');
const ASSET_PATH = path.resolve(__dirname, '../', '../', '../', 'public/assets');
const MODULES_PATH = path.join(ROOT_PATH, './node_modules');

module.exports = {
  CURRENT_PATH: CURRENT_PATH,
  ROOT_PATH: ROOT_PATH,
  PUBLIC_PATH: PUBLIC_PATH,
  ASSET_PATH: ASSET_PATH,
  MODULES_PATH: MODULES_PATH
};
