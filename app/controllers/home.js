import models from '../models/index';
import _ from 'lodash';
import fs from 'fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import objectAssign from 'object-assign';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from '../frontend/js/App/reducers/index';
import Index from '../frontend/js/App/Index.js';

const index = async (ctx, _next) => {
  const prerenderHtml = await handleRender(ctx.state.preloadedState);
  const locals = {
    title: 'Home',
    nav: 'index',
    prerenderHtml: prerenderHtml,
    baseUrl: '/',
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

const handleRender = async (preloadedState) => {
  let {
    locale,
    currentUser,
    captcha,
  } = preloadedState;
  let props = {
    locale: locale,
    userInfo: currentUser,
    captcha: captcha,
  }
  const store = createStore(reducer, props);
  const html = renderToString(
    <Provider store={store}>
      <Index />
    </Provider>
  );
  return html;
}

export default {
  index,
  about
};
