import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  fetchArticle,
  setIsNotFound,
} from '../../actions/index';

import Validator from '../../../common/my_validator';
let validator = new Validator();

import Utils from '../../../common/utils';

import MobileNav from '../../components/MobileNav/Index';
import Nav from '../../components/Nav/Index';
import Footer from '../../components/Footer/Index';
import NotFound from '../NotFound';

class Article extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: typeof window !== 'undefined' ? true : false,
    }
  }

  setIsLoading(bool) {
    this.setState({isLoading: bool});
  }

  componentDidMount() {
    if (window){
      require('../../../../css/articles.css');
    }
    if (!_.isNull(this.props.article)){
      this.setIsLoading(false);
      if ((this.props.params.id != this.props.article.id) || (this.props.params.id != this.props.article.uniqueKey)){
        this.props.fetchArticle(this.props.params.id);
      }
    }
    else{
      if (this.props.params.id){
        this.props.fetchArticle(this.props.params.id);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (_.isNull(prevProps.article) && !_.isNull(this.props.article)){
      this.setIsLoading(false);
    }
  }

  handleImageLoaded() {
    Utils.stopSpin('cover-spin-loader');
  }

  createContent() {
    return {__html: this.state.content};
  }

  go(url) {
    this.context.router.push(url);
  }

  render() {
    let contentHtml;
    let {
      locale,
      isNotFound,
      article,
      currentUser,
    } = this.props;
    let {
      isLoading,
    } = this.state;

    if (isNotFound){
      contentHtml = (<NotFound />);
    }
    else{
      let LANG_NAV = require('../../../../../locales/' + locale + '/nav');
      let LANG_ARTICLE = require('../../../../../locales/' + locale + '/article');
      let LANG_ACTION = require('../../../../../locales/' + locale + '/action');
      let LANG_GENERAL = require('../../../../../locales/' + locale + '/general');
      let articleCategoryOptionsHtml;
      let editArticleButton;
      let coverHtml;

      if (!isLoading){
        let {
          id,
          title,
          uniqueKey,
          author,
          preface,
          desc,
          cover,
          articleCategory,
          type,
          tag,
          isBanned,
          isPrivate,
          content,
        } = article;
        if (cover != ''){
          // coverHtml = <img className="" src={`${cover}?imageView/1/w/${300}/h/${300}`} style={{'width':'100%'}} onLoad={this.handleImageLoaded.bind(this)}/>;
          coverHtml = <img className="" src={`${cover}`} style={{'width':'100%'}} onLoad={this.handleImageLoaded.bind(this)}/>;
        }
        else{
          coverHtml = <span className="icon icon-sentiment-satisfied"></span>;
        }
        if (!_.isNull(currentUser) && currentUser.role == 'admin'){
          editArticleButton = (
            <div className="my-button my-button--blue" onClick={this.go.bind(this, '/articles/' + uniqueKey + '/edit')}>{LANG_ACTION['edit']}{LANG_NAV['article']}</div>
          );
        }
        contentHtml = (
          <div className="page-content article background-white">
            <MobileNav isIndex={false} activeTab="articles"/>
            <Nav isIndex={false} activeTab="articles"/>
            <div className="core-content background-white">
              <div className="core">
                <div className="my-button my-button--red mgr-10" onClick={this.go.bind(this, '/articles/')}>{LANG_NAV['back']}</div>
                {editArticleButton}
                <div className="mgt-10">
                  <div className="article-item__title">{title}</div>
                  <div className="article-item__author">{author}</div>
                  {coverHtml != '' ? <div className="article-item__image">{coverHtml}</div> : ''}
                  {preface != '' ? <div className="article-item__preface">{preface}</div> : ''}
                  {desc != '' ? <div className="article-item__desc">{desc}</div> : ''}
                  {articleCategory != '' ? <div className="row-wrapper">{articleCategory}</div> : ''}
                  {tag != '' ? <div className="row-wrapper">{tag}</div> : ''}
                  <div dangerouslySetInnerHTML={this.createContent()}></div>
                  <div className="height-20"></div>
                  <div className="">
                    {isBanned ? `${LANG_ARTICLE['banned']}` : ``}
                  </div>
                  <div className="">
                    {isPrivate ? `${LANG_ARTICLE['private']}` : ``}
                  </div>
                  <div className="height-20"></div>
                </div>
              </div>
              <div className="push"></div>
            </div>
            <Footer/>
          </div>
        );
      }
    }
    return(
      <div className="page">
        {contentHtml}
      </div>
    );
  }
}

function mapStateToProps(state) {
  let {
    locale,
    article,
    isNotFound,
    currentUser,
  } = state;
  return {
    locale,
    article,
    isNotFound,
    currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchArticle: (id) => {
      dispatch(fetchArticle(id));
    },
    setIsNotFound: (val) => {
      dispatch(setIsNotFound(val));
    },
  };
}

Article.contextTypes = {
  router: React.PropTypes.object
};

Article.propTypes = {
  params: React.PropTypes.object,
  location: React.PropTypes.object,
  isLoading: React.PropTypes.bool,
  locale: React.PropTypes.string,
  currentUser: React.PropTypes.object,
  article: React.PropTypes.object,
  fetchArticle: React.PropTypes.func,
  setIsNotFound: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Article);