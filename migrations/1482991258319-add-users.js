'use strict'
var bcrypt = require('bcrypt');
var mongoose = require('../db/index');
var Schema = mongoose.Schema;

const saltRounds = 10;
const password = '123456';

var hash = bcrypt.hashSync(password, saltRounds);

var usersList = [{
  nickname: 'admin',
  role: 'admin',
  phone: '0123456789',
  email: 'admin@example.com',
  avatar: '',
  password: hash,
}];
var UserSchema = new Schema({
  nickname: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  avatar: { type: String },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
var User = mongoose.model('users', UserSchema);

exports.up = function(next) {
  User.insertMany(usersList, function(error, docs) {});
  next();
};

exports.down = function(next) {
  User.remove({}, function(err) {});
  next();
};
