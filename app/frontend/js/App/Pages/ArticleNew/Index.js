import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import RichTextEditor from 'react-rte';
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
      value: RichTextEditor.createEmptyValue()
    }
  }

  setIsLoading(bool) {
    this.setState({isLoading: bool});
  }

  componentDidMount() {
    if (!_.isNull(this.props.userInfo) && this.props.userInfo.role == 'admin'){
      this.setIsLoading(false);
    }
    else{
      this.props.setIsNotFound(true);
    }
  }

  onChange(value) {
    console.log(value);
    this.setState({value});
    if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange(
        value.toString('html')
      );
    }
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
            <RichTextEditor
              value={this.state.value}
              onChange={this.onChange.bind(this)}
            />
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
    setIsNotFound: (val) => {
      dispatch(setIsNotFound(val));
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