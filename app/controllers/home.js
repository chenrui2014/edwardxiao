import models from '../models/index';
import _ from 'lodash';
import fs from 'fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import objectAssign from 'object-assign';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from '../frontend/js/App/reducers/index';
import Index from '../frontend/js/App/index.js';

const index = async (ctx, _next) => {
  const prerenderHtml = await handleRender(ctx.state.preloadedState, <Index/>);
  const locals = {
    title: 'Edward Xiao',
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
  about
};
