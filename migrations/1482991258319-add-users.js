'use strict'
var mongoose = require('../db/index');
var Schema = mongoose.Schema;

var usersList = [{
  name:'admin',
  role: 'admin',
  phone: '0123456789',
  email: 'admin@example.com',
  password: '123456',
}];
var UserSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
var User = mongoose.model('users', UserSchema);

exports.up = function(next) {
  User.insertMany(usersList, function(error, docs) {});
  next();
};

exports.down = function(next) {
  User.remove({}, function (err) {});
  next();
};