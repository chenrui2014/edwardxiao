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

  render() {
    let content;
    let {
      isNotFound,
      articleList,
    } = this.props;
    let {
      isLoading
    } = this.state;
    if (isNotFound){
      content = (<NotFound />);
    }
    else{
      if (!isLoading){

      }
      let backUrl = this.state.backUrl;
      content = (
        <div className="page-content">
          <MobileNav isIndex={false} activeTab="articles"/>
          <Nav isIndex={false} activeTab="articles"/>
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
    articleList,
    isNotFound,
  } = state;
  return {
    articleList,
    isNotFound,
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
  articleList: React.PropTypes.object.isRequired,
  fetchArticleList: React.PropTypes.func.isRequired,
  setIsNotFound: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);