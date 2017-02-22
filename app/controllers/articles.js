import models from '../models/index';
import _ from 'lodash';
import fs from 'fs';
import helper from './helper';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from '../frontend/js/App/reducers/index';
import Article from '../frontend/js/App/pages/Article/index.js';
import ArticleList from '../frontend/js/App/pages/ArticleList/index.js';

const index = async(ctx, _next) => {
  let categoryQuery;
  const currentUser = ctx.state.preloadedState.currentUser;
  if (!_.isNull(currentUser) && currentUser.role == 'admin'){
    query = {uniqueKey: {'$ne': 'root'}};
  }
  else{
    query = { isBanned: false, isPrivate: false, $and:[{isAdminOnly: false}] };
  }
  let categorySelect = ['title', 'uniqueKey', 'author', 'preface', 'desc', 'content', 'articleCategory', 'sequence', 'cover', 'type', 'level', 'tag', 'isBanned', 'isPrivate', 'isAdminOnly', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];
  let categoryPopulate = 'createdBy';
  let categorySort = { sequence: 1 };
  let categoryRes = await helper.getArticleCategories(categoryQuery, categorySelect, categorySort, true, categoryPopulate, 1, 15);
  let articleCategoryList;
  if (categoryRes && categoryRes.data.length){
    articleCategoryList = categoryRes.data;
  }

  let {
    page,
    perPage,
    category,
    type,
  } = ctx.request.query;
  if (_.isUndefined(page) || page === '') {
    page = 1;
  }
  if (_.isUndefined(perPage) || perPage === '') {
    perPage = 15;
  }
  page = _.toNumber(page);
  perPage = _.toNumber(perPage);

  let query;
  if (!_.isNull(currentUser) && currentUser.role == 'admin') {
    query = _.merge(query, { uniqueKey: { '$ne': 'root' } });
  } else {
    query = _.merge(query, { isBanned: false, isPrivate: false, $and: [{ isAdminOnly: false }] });
  }
  if (category == 'all') {
    category = '';
  }
  if (category && category != '') {
    query = _.merge(query, { articleCategory: category });
  }
  if (type == '') {
    type = '';
  }
  if (type && type != '') {
    query = _.merge(query, { type: type });
  }
  let code = 0;
  let data = [];
  let pages = 0;
  let select = ['title', 'uniqueKey', 'author', 'preface', 'desc', 'content', 'articleCategory', 'sequence', 'cover', 'type', 'tag', 'isBanned', 'isPrivate', 'isAdminOnly', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];
  let populate = 'createdBy';
  let sort = { sequence: 1 };
  let res = await helper.getArticles(query, select, sort, true, populate, page, perPage);
  let articleList = null;
  let articleListCurrentPage = 0;
  let articleListTotalPage = 0;
  if (res && res.data.length) {
    articleList = res.data;
    articleListCurrentPage = page;
    articleListTotalPage = res.pages;
  }

  let preloadedState = _.merge(ctx.state.preloadedState, { articleList, articleCategoryList, articleListCurrentPage, articleListTotalPage });
  const prerenderHtml = await handleRender(preloadedState, <ArticleList/>);

  const locals = {
    title: 'Home',
    nav: 'index',
    prerenderHtml: prerenderHtml,
    preloadedState: preloadedState,
    baseUrl: '/',
  };
  await ctx.render('article/index', locals);
};

const show = async(ctx, _next) => {
  let {
    id,
  } = ctx.params;
  console.log(88888);
  console.log(id);
  console.log(88888);
  let query = { uniqueKey: id };
  let code = 0;
  let data = [];
  let select = ['title', 'uniqueKey', 'author', 'preface', 'desc', 'content', 'articleCategory', 'sequence', 'cover', 'type', 'level', 'tag', 'isBanned', 'isPrivate', 'isAdminOnly', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];
  let populate = 'createdBy';
  let res = await helper.getArticles(query, select, '', true, populate);
  let ObjectId = require('mongoose').Types.ObjectId;
  if (!res.data.length && ObjectId.isValid(id)) {
    query = { _id: id };
    res = await helper.getArticles(query, select, '', true, populate);
  }
  let article = null;
  if (res && res.data.length) {
    article = res.data[0];
  }
  let preloadedState = _.merge(ctx.state.preloadedState, { article });
  const prerenderHtml = await handleRender(preloadedState, <Article/>);
  console.log(prerenderHtml);
  const locals = {
    title: 'Home',
    nav: 'index',
    prerenderHtml: prerenderHtml,
    preloadedState: preloadedState,
    baseUrl: '/',
  };
  await ctx.render('article/show', locals);
};

const handleRender = async(preloadedState, component) => {
  let newState = {};
  Object.keys(preloadedState).map((key) => {
    if (key !== 'csrf' && key !== 'captchaData' && key !== 'qiniuDomain'){
      newState[key] = preloadedState[key];
    }
  });
  const store = createStore(reducer, newState);
  const html = renderToString(
    <Provider store={store}>
      {component}
    </Provider>
  );
  return html;
}

export default {
  index,
  show,
};
