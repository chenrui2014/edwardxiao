'use strict'
var mongoose = require('../db/index');
var Schema = mongoose.Schema;

var articleList = [{
  title:'title',
  preface: 'preface',
  desc: 'desc',
  content: 'content',
  cover: '',
  isShow: false,
}];
var ArticleSchema = new Schema({
  title: { type: String, required: true },
  preface: { type: String },
  desc: { type: String },
  content: { type: String, required: true },
  cover: { type: String },
  isShow: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
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