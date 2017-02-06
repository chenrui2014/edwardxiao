'use strict'
var mongoose = require('../db/index');
var Schema = mongoose.Schema;

var articleList = [{
  title:'title',
  author: 'admin',
  preface: 'preface',
  desc: 'desc',
  content: 'content',
  cover: '',
  type: '',
  isShow: false,
  createdBy: '5892eeac50b2e30d8011e71c',
  updatedBy: '5892eeac50b2e30d8011e71c',
}];
var ArticleSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  preface: { type: String },
  desc: { type: String },
  content: { type: String, required: true },
  cover: { type: String },
  type: { type: String },
  isShow: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true },
});
var ArticleSchema = mongoose.model('article', ArticleSchema);

exports.up = function(next) {
  ArticleSchema.insertMany(articleList, function(error, docs) {});
  next();
};

exports.down = function(next) {
  ArticleSchema.remove({}, function (err) {});
  next();
};