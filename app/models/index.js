import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import config from '../../config/config';
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/edwardxiao');
mongoose.connect(config.dbUrl);
const basename = path.basename(module.filename);
const db = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = require(path.join(__dirname, file));
    let name = file.slice(0, -3);
    name = name[0].toUpperCase() + name.slice(1);
    db[name] = model.default;
  });

export default db;
