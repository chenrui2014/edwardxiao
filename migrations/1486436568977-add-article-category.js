'use strict'
var mongoose = require('../db/index');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var id = mongoose.Types.ObjectId('56cb91bdc3464f14678934ca');

var articleCategoryList = [
  {
    _id: mongoose.Types.ObjectId('ce1cc9334ae8c66be6db982d'),
    title: 'logo design',
    author: 'admin',
    preface: 'preface',
    desc: 'desc',
    content: 'content',
    cover: '',
    type: 0,
    level: 0,
    tag: '',
    isBanned: false,
    isPrivate: false,
    articleCategory: mongoose.Types.ObjectId('ce1cc9334ae8c66be6db982d'),
    createdBy: id,
    updatedBy: id,
  },
  {
    _id: mongoose.Types.ObjectId('ce2cc9334ae8c66be6db982d'),
    title: 'industrial design',
    author: 'admin',
    preface: 'preface',
    desc: 'desc',
    content: 'content',
    cover: '',
    type: 0,
    level: 0,
    tag: '',
    isBanned: false,
    isPrivate: false,
    articleCategory: mongoose.Types.ObjectId('ce2cc9334ae8c66be6db982d'),
    createdBy: id,
    updatedBy: id,
  },
  {
    _id: mongoose.Types.ObjectId('ce3cc9334ae8c66be6db982d'),
    title: 'graphic design',
    author: 'admin',
    preface: 'preface',
    desc: 'desc',
    content: 'content',
    cover: '',
    type: 0,
    level: 0,
    tag: '',
    isBanned: false,
    isPrivate: false,
    articleCategory: mongoose.Types.ObjectId('ce3cc9334ae8c66be6db982d'),
    createdBy: id,
    updatedBy: id,
  },
  {
    _id: mongoose.Types.ObjectId('ce4cc9334ae8c66be6db982d'),
    title: 'web design',
    author: 'admin',
    preface: 'preface',
    desc: 'desc',
    content: 'content',
    cover: '',
    type: 0,
    level: 0,
    tag: '',
    isBanned: false,
    isPrivate: false,
    articleCategory: mongoose.Types.ObjectId('ce4cc9334ae8c66be6db982d'),
    createdBy: id,
    updatedBy: id,
  },
];

var ArticleCategorySchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  preface: { type: String },
  desc: { type: String },
  content: { type: String, required: true },
  cover: { type: String },
  type: { type: Number },
  level: { type: Number },
  tag: { type: String },
  isBanned: { type: Boolean },
  isPrivate: { type: Boolean },
  articleCategory: { type: ObjectId, ref: 'ArticleCategories' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: ObjectId, ref: 'Users' },
  updatedBy: { type: ObjectId, ref: 'Users' },
});
var ArticleCategorySchema = mongoose.model('ArticleCategories', ArticleCategorySchema);

exports.up = function(next) {
  ArticleCategorySchema.insertMany(articleCategoryList, function(error, docs) {});
  next();
};

exports.down = function(next) {
  ArticleCategorySchema.remove({}, function (err) {});
  next();
};