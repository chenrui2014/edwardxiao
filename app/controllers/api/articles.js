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
  let articleList = [];
  let pages = 0;

  let select = ['title', 'author', 'preface', 'desc', 'content', 'articleCategory', 'cover', 'type', 'isBanned', 'isPrivate', 'isPrivate', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];
  let populate = 'articleCategory createdBy';
  let query = { isBanned: false, isPrivate: false };
  let sort = { updatedBy: -1 };
  let res = await getArticles(query, select, sort, true, populate, page, perPage);
  console.log('======');
  console.log(res);
  data = res.data;
  pages = res.pages;
  ctx.body = { code, data, page, pages };
};

const show = async(ctx, _next) => {
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
  let articleList = [];
  let pages = 0;

  let select = ['title', 'author', 'preface', 'desc', 'content', 'articleCategory', 'cover', 'type', 'isBanned', 'isPrivate', 'isPrivate', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'];
  let populate = 'articleCategory createdBy';
  let query = { isBanned: false, isPrivate: false };
  let sort = { updatedBy: -1 };
  let res = await getArticles(query, select, sort, true, populate, page, perPage);
  console.log('======');
  console.log(res);
  data = res.data;
  pages = res.pages;
  ctx.body = { code, data, page, pages };
};

const newArticle = async(ctx, _next) => {
  const locals = {
    nav: 'articleNew'
  };
  await ctx.render('articles/new', locals);
};

const create = async(ctx, _next) => {
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
    tag,
    isBanned,
    isPrivate,
    articleCategory,
  } = ctx.state.articleParams;
  let data = {
    title,
    author,
    preface,
    desc,
    content,
    cover,
    type,
    tag,
    isBanned,
    isPrivate,
    articleCategory,
    createdBy: userId,
  };
  let code = 0;
  let id = '';
  await models.Article.create(data, (err, res) => {
    if (err) {
      code = 1;
      return handleError(err);
    }
    console.log(res);
    id = res.id;
    // saved!
  });
  ctx.body = { code, id };
};

const edit = async(ctx, _next) => {
  const locals = {
    title: '编辑',
    nav: 'article'
  };
  await ctx.render('articles/edit', locals);
};

const update = async(ctx, _next) => {
  let article = ctx.state.article;
  article = await article.update(ctx.state.articleParams);
  ctx.redirect('/articles/' + article.id);
  return;
};

const checkLogin = async(ctx, next) => {
  console.log(ctx.state.isUserSignIn);
  if (!ctx.state.isUserSignIn) {
    ctx.status = 302;
    ctx.redirect('/');
    return;
  }
  await next();
};

const checkArticleOwner = async(ctx, next) => {
  const currentUser = ctx.state.currentUser;
  const article = await models.Article.findOne({
    where: {
      id: ctx.params.id,
      userId: currentUser.id
    }
  });
  if (article == null) {
    ctx.redirect('/');
    return;
  }
  ctx.state.article = article;
  await next();
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
    tag,
    isBanned,
    isPrivate,
    articleCategory,
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
    tag: tag,
    isBanned: isBanned,
    isPrivate: isPrivate,
    articleCategory: articleCategory,
  };
  await next();
};

const getArticles = async(query = '', select, sort = '', lean = true, populate = '', page = 0, perPage = 0) => {

  let data = [];
  let pages;
  let options = {
    select,
    sort,
    lean,
  };
  if (populate != '') {
    options['populate'] = populate;
  }
  if (page != 0) {
    options['page'] = page;
  }
  if (perPage != 0) {
    options['limit'] = perPage;
  }
  await models.Article.paginate(query, options).then((result) => {
    console.log(result);
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
  index,
  show,
  newArticle,
  create,
  edit,
  update,
  checkLogin,
  checkArticleOwner,
  checkParamsBody
};
