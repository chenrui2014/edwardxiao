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
        <Route path="404" component={NotFound}/>
      </Route>
      <Route path="*" component={NotFound}/>
    </Router>
  </Provider>,
  document.getElementById('root')
);

