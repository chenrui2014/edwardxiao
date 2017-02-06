import models from '../../models/index';
import _ from 'lodash';

const show = async (ctx, _next) => {
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

  let query = {isShow: false};
  let options = {
      select: 'title author preface desc content cover type isShow createdAt updatedAt createdBy updatedBy',
      sort: { updatedBy: -1 },
      lean: true,
      page: page,
      limit: perPage
  };

  await models.Article.paginate(query, options).then((result) => {
    console.log(result);
    if (result.docs.length){
      result.docs.map((item, key) => {
        articleList.push({
          id: item.id,
          title: item.title,
          author: item.author,
          preface: item.preface,
          desc: item.desc,
          content: item.content,
          cover: item.cover,
          type: item.type,
          isShow: item.isShow,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          createdBy: item.createdBy,
          updatedBy: item.updatedBy,
        });
      });
      pages = result.pages;
    }
  });
  console.log(articleList);
  data = articleList;
  // if (articleList.length) {

  // }
  ctx.body = { code, data, page, pages };
};

const newArticle = async (ctx, _next) => {
  const locals = {
    nav: 'articleNew'
  };
  await ctx.render('articles/new', locals);
};

const create = async (ctx, _next) => {
  const currentUser = ctx.state.currentUser;
  const article = await currentUser.createArticle(ctx.state.articleParams);
  // await models.Article.create(articleParams)
  ctx.redirect('/articles/' + article.id);
  return;
};

const edit = async (ctx, _next) => {
  const locals = {
    title: '编辑',
    nav: 'article'
  };
  await ctx.render('articles/edit', locals);
};

const update = async (ctx, _next) => {
  let article = ctx.state.article;
  article = await article.update(ctx.state.articleParams);
  ctx.redirect('/articles/' + article.id);
  return;
};

const checkLogin = async (ctx, next) => {
  if(!ctx.state.isUserSignIn){
    ctx.status = 302;
    ctx.redirect('/');
    return;
  }
  await next();
};

const checkArticleOwner = async (ctx, next) => {
  const currentUser = ctx.state.currentUser;
  const article = await models.Article.findOne({
    where: {
      id: ctx.params.id,
      userId: currentUser.id
    }
  });
  if(article == null){
    ctx.redirect('/');
    return;
  }
  ctx.state.article = article;
  await next();
};

const checkParamsBody = async (ctx, next) => {
  const body = ctx.request.body;
  if (!(body.title && body.content && body.description)) {
    const locals = {
      nav: 'articleNew',
      message: 'params error'
    };
    if(ctx.params.id){
      await ctx.render('articles/edit', locals);
    } else {
      await ctx.render('articles/new', locals);
    }
    return;
  }
  ctx.state.articleParams = {
    title: body.title,
    description: body.description,
    content: body.content
  };
  await next();
};

export default {
  show,
  newArticle,
  create,
  edit,
  update,
  checkLogin,
  checkArticleOwner,
  checkParamsBody
};
