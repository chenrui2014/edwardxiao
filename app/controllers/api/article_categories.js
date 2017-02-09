import models from '../../models/index';
import _ from 'lodash';

const index = async(ctx, _next) => {
  let {
    page,
    perPage,
  } = ctx.request.body;
  if (_.isUndefined(page) || page === '') {
    page = 1;
  }
  if (_.isUndefined(perPage) || perPage === '') {
    perPage = 15;
  }
  let code = 0;
  let data = [];
  let pages = 0;
  let select = ['title', 'author', 'preface', 'desc', 'content', 'articleCategory', 'sequence', 'cover', 'type', 'level', 'tag', 'isBanned', 'isPrivate', 'isPrivate', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];
  let populate = 'articleCategory createdBy';
  let query = { isBanned: false, isPrivate: false };
  let sort = { sequence: 1 };
  let res = await getArticleCategories(query, select, sort, true, populate, page, perPage);
  console.log('======');
  console.log(res);
  data = res.data;
  pages = res.pages;
  ctx.body = { code, data, page, pages };
};

const show = async(ctx, _next) => {
  let {
    id,
  } = ctx.params;
  let code = 0;
  let data = [];
  let select = ['title', 'author', 'preface', 'desc', 'content', 'articleCategory', 'sequence', 'cover', 'type', 'level', 'tag', 'isBanned', 'isPrivate', 'isPrivate', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];
  let populate = 'articleCategory createdBy';
  let query = { _id: id };
  let res = await getArticleCategories(query, select, '', true, populate);
  console.log(res);
  data = res.data;
  ctx.body = { code, data };
};

const create = async(ctx, _next) => {
  let LANG_MESSAGE = require('../../locales/' + ctx.session.locale + '/message');
  let LANG_ARTICLE = require('../../locales/' + ctx.session.locale + '/article');
  let LANG_GENERAL = require('../../locales/' + ctx.session.locale + '/general');
  const currentUser = ctx.state.currentUser;
  let mongoose = require('mongoose');
  let userId = mongoose.Types.ObjectId(currentUser.id);
  let {
    title,
    author,
    preface,
    desc,
    content,
    cover,
    type,
    level,
    tag,
    isBanned,
    isPrivate,
    articleCategory,
    sequence,
  } = ctx.state.articleParams;
  let data = {
    title,
    author,
    preface,
    desc,
    content,
    cover,
    type,
    level,
    tag,
    isBanned,
    isPrivate,
    articleCategory,
    sequence: _.toNumber(sequence),
    createdBy: userId,
  };
  let code = 0;
  let msg = '';
  let id = '';
  console.log(data);
  let isDuplicate = false;
  await models.ArticleCategory.findOne({title: title}, (err, res) => {
    if (err) {
      code = 1;
      throw err;
    }
    if (!_.isNull(res)){
      isDuplicate = true;
    }
  });
  if (isDuplicate){
    code = 1;
    msg = LANG_ARTICLE['title'] + LANG_GENERAL['space-en'] + LANG_MESSAGE['already-exist'];
  }
  else{
    await models.ArticleCategory.create(data, (err, res) => {
      if (err) {
        code = 1;
        throw err;
      }
      console.log(res);
      id = res.id;
      // saved!
    });
  }
  ctx.body = { code, id, msg };
};

const update = async(ctx, _next) => {
  let LANG_MESSAGE = require('../../locales/' + ctx.session.locale + '/message');
  let LANG_ARTICLE = require('../../locales/' + ctx.session.locale + '/article');
  let LANG_GENERAL = require('../../locales/' + ctx.session.locale + '/general');
  const currentUser = ctx.state.currentUser;
  let mongoose = require('mongoose');
  let userId = mongoose.Types.ObjectId(currentUser.id);
  let {
    id,
    title,
    author,
    preface,
    desc,
    content,
    cover,
    type,
    level,
    tag,
    isBanned,
    isPrivate,
    articleCategory,
    sequence,
  } = ctx.state.articleParams;
  let data = {
    id,
    title,
    author,
    preface,
    desc,
    content,
    cover,
    type,
    level,
    tag,
    isBanned,
    isPrivate,
    articleCategory,
    sequence,
    createdBy: userId,
  };
  let code = 0;
  let msg = '';
  let isDuplicate = false;
  await models.ArticleCategory.findOne({title: title}, (err, res) => {
    if (err) {
      code = 1;
      throw err;
    }
    if (!_.isNull(res) && res._id != id){
      isDuplicate = true;
    }
  });
  if (isDuplicate){
    code = 1;
    msg = LANG_ARTICLE['title'] + LANG_GENERAL['space-en'] + LANG_MESSAGE['already-exist'];
  }
  else{
    await models.ArticleCategory.update({ _id: id }, data, { multi: false }, (err, res) => {
      if (err) {
        console.log(err);
        code = 1;
        throw err;
      }
      console.log(res);
      // saved!
    })
  }
  ctx.body = { code, id, msg };
};

const remove = async(ctx, _next) => {
  let code = 0;
  let id = ctx.params.id;
  console.log(id);
  await models.ArticleCategory.findOneAndRemove({ _id: id }, (err, res) => {
    if (err) {
      console.log(err);
      code = 1;
      throw err;
    }
    console.log(res);
    // deleted!
  })
  ctx.body = { code, id };
}

const checkLogin = async(ctx, next) => {
  console.log(ctx.state.isUserSignIn);
  if (!ctx.state.isUserSignIn) {
    ctx.status = 302;
    ctx.redirect('/');
    return;
  }
  await next();
};

const checkArticleCategoryOwner = async(ctx, next) => {
  let LANG_MESSAGE = require('../../locales/' + ctx.session.locale + '/message');
  const currentUser = ctx.state.currentUser;
  let id = ctx.params.id;
  let select = ['_id', 'createdBy'];
  let populate = 'createdBy';
  let query = { _id: id };
  let res = await getArticleCategories(query, select, '', true, populate);
  if (res.data.length) {
    console.log(res.data[0]);
    if (res.data[0].createdBy['_id'].equals(currentUser.id)) {
      await next();
    } else {
      ctx.body = { code: 1, data: {}, msg: LANG_MESSAGE['error-on-unauthorized'] };
    }
  } else {
    ctx.body = { code: 1, data: {}, msg: LANG_MESSAGE['error-on-unauthorized'] };
  }
  return;
};

const checkParamsBody = async(ctx, next) => {
  const body = ctx.request.body;
  let {
    id,
    title,
    author,
    preface,
    desc,
    content,
    cover,
    type,
    level,
    tag,
    isBanned,
    isPrivate,
    articleCategory,
    sequence,
  } = body;
  if (title == '') {
    return false;
  }
  ctx.state.articleParams = {
    id: id,
    title: title,
    author: author,
    preface: preface,
    desc: desc,
    content: content,
    cover: cover,
    type: type,
    level: level,
    tag: tag,
    isBanned: isBanned,
    isPrivate: isPrivate,
    articleCategory: articleCategory,
    sequence: sequence,
  };
  await next();
};

const getCategorieOptions = async(ctx, _next) => {
  let code = 0;
  let data = [];
  let select = ['title'];
  let populate = 'articleCategory createdBy';
  let query = { isBanned: false, isPrivate: false };
  let sort = { updatedBy: -1 };
  let res = await getArticleCategories(query, select, sort, true, populate);
  data = res.data;
  ctx.body = { code, data };
};

const getArticleCategories = async(query = '', select, sort = '' , lean = true, populate = '', page = 0, perPage = 0) => {

  let data = [];
  let pages;
  let options = {
    select,
    sort,
    lean,
  };
  if (populate != ''){
    options['populate'] = populate;
  }
  if (page != 0) {
    options['page'] = page;
  }
  if (perPage != 0) {
    options['limit'] = perPage;
  }
  await models.ArticleCategory.paginate(query, options).then((result) => {
    // console.log(result);
    if (result.docs.length) {
      data = result.docs;
      pages = result.pages;
    }
  });
  let result = {
    data,
    pages,
  }
  return result;
}


export default {
  getCategorieOptions,
  index,
  show,
  create,
  update,
  remove,
  checkLogin,
  checkArticleCategoryOwner,
  checkParamsBody,
};
