const Config = require('../config/config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(Config.dbUrl);
module.exports = mongoose;

