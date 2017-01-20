import models from '../models/index';
import fs from 'fs';

const index = async (ctx, _next) => {
  let page = parseInt(ctx.query.page, 10) || 1;
  page = page > 0 ? page : 1;
  let pageOffset = ( page - 1 ) * 10;
  let a = await models.Article.find({isShow: false}).sort({'date': -1}).limit(20);
  // console.log('[[[[[');
  // console.log(a);
  // console.log(']]]]]');
  const locals = {
    title: 'Home',
    nav: 'index',
    // prerenderHtml: prerenderHtml,
    preloadedState: { articles: '' },
    baseUrl: '/',
    // pages: parseInt(articleCount / 10 + 1)
  };
  await ctx.render('home/index', locals);
};

const about = async (ctx, _next) => {
  const readme = fs.readFileSync('README.md', 'utf8');
  const locals = {
    title: 'About',
    nav: 'about',
    content: readme,
  };
  await ctx.render('home/about', locals);
};

export default {
  index,
  about
};
