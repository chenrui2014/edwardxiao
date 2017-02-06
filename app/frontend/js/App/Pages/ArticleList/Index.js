import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  fetchArticleList,
  setIsNotFound,
} from '../../actions/index';

import Utils from '../../../common/utils';

import MobileNav from '../../components/MobileNav/index';
import Nav from '../../components/Nav/index';
import NotFound from '../NotFound';
import '../../../../css/articles.css';

class ArticleList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      backUrl: null,
    }
  }

  setIsLoading(bool) {
    this.setState({isLoading: bool});
  }

  componentDidMount() {
    this.setIsLoading(false);
  }

  go(url) {
    this.context.router.push(url);
  }

  render() {
    let content;
    let {
      locale,
      isNotFound,
      articleList,
      userInfo,
    } = this.props;
    let {
      isLoading
    } = this.state;
    if (isNotFound){
      content = (<NotFound />);
    }
    else{
      let LANG_USER = require('../../../../../locales/' + locale + '/user');
      let LANG_ACTION = require('../../../../../locales/' + locale + '/action');
      let LANG_NAV = require('../../../../../locales/' + locale + '/nav');
      let articleListHtml;
      let newArticleButton;
      if (!isLoading){
        if (!_.isNull(userInfo) && userInfo.role == 'admin'){
          newArticleButton = (
            <div className="my-button my-button--red" onClick={this.go.bind(this, '/articles/new')}>{LANG_ACTION['add']}{LANG_NAV['article']}</div>
          );
        }
      }
      let backUrl = this.state.backUrl;
      console.log(userInfo);
      content = (
        <div className="page-content">
          <MobileNav isIndex={false} activeTab="articles"/>
          <Nav isIndex={false} activeTab="articles"/>
          <div className="core-content">
            {newArticleButton}
            {articleListHtml}
          </div>
        </div>
      );
    }
    return(
      <div className="page">
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  let {
    locale,
    articleList,
    isNotFound,
    userInfo,
  } = state;
  return {
    locale,
    articleList,
    isNotFound,
    userInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchArticleList: () => {
      dispatch(fetchArticleList());
    },
  };
}

ArticleList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

ArticleList.propTypes = {
  params: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  isLoading: React.PropTypes.bool.isRequired,
  locale: React.PropTypes.string.isRequired,
  userInfo: React.PropTypes.object.isRequired,
  articleList: React.PropTypes.array.isRequired,
  fetchArticleList: React.PropTypes.func.isRequired,
  setIsNotFound: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);