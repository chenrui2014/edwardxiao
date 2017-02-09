import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import { reducer } from './App/reducers/index';
import { syncHistoryWithStore } from 'react-router-redux';
import objectAssign from 'object-assign';

import Main from './App/main';
import Index from './App/index';
import ArticleList from './App/Pages/ArticleList/Index';
import ArticleForm from './App/Pages/ArticleForm/Index';
import Article from './App/Pages/Article/Index';
import ArticleCategoryList from './App/Pages/ArticleCategoryList/Index';
import ArticleCategoryForm from './App/Pages/ArticleCategoryForm/Index';
import ArticleCategory from './App/Pages/ArticleCategory/Index';
import NotFound from './App/Pages/NotFound/Index';
import '../css/index.css';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
let history = syncHistoryWithStore(browserHistory, store);
history = objectAssign(history, {
  goSmartBack: () => {
    if (window.history.length >= 1 && window.history.length <= 2) {
      history.push('/');
    } else {
      history.goBack();
    }
  },
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={Main}>
        <IndexRoute component={Index}></IndexRoute>
        <Route path='/articles' component={ArticleList}></Route>
        <Route path='/articles/new' component={ArticleForm}></Route>
        <Route path='/articles/:id' component={Article}></Route>
        <Route path='/articles/:id/edit' component={ArticleForm}></Route>
        <Route path='/article_categories' component={ArticleCategoryList}></Route>
        <Route path='/article_categories/new' component={ArticleCategoryForm}></Route>
        <Route path='/article_categories/:id' component={ArticleCategory}></Route>
        <Route path='/article_categories/:id/edit' component={ArticleCategoryForm}></Route>
        <Route path="404" component={NotFound}/>
      </Route>
      <Route path="*" component={NotFound}/>
    </Router>
  </Provider>,
  document.getElementById('root')
);

