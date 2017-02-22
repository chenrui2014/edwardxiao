import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  setIsNotFound,
} from '../../actions/index';

import Utils from '../../../common/utils';

import MobileNav from '../../components/MobileNav/Index';
import Nav from '../../components/Nav/Index';
import Footer from '../../components/Footer/Index';
import NotFound from '../NotFound/Index';
import '../../../../css/articles.css';

class ArticleCategory extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      backUrl: null,
      id: '',
      title: '',
      uniqueKey: '',
      author: '',
      preface: '',
      desc: '',
      cover: '',
      articleCategory: '',
      type: '',
      tag: '',
      isBanned: false,
      isPrivate: false,
      content: '',
      articleCategoryOptions: [],
      // isUploading: false,
    }
  }

  setIsLoading(bool) {
    this.setState({isLoading: bool});
  }

  componentDidMount() {
    let currentUser = this.props.currentUser;
    if (!_.isNull(currentUser) && currentUser.role == 'admin'){
      this.fetchArticleCategory(this.props.params.id);
    }
    else{
      this.props.setIsNotFound(true);
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   // if (prevState.id == '' && this.state.id !== ''){
  //   //   this.setIsLoading(false);
  //   // }
  // }

  handleImageLoaded() {
    Utils.stopSpin('cover-spin-loader');
  }

  fetchArticleCategory(id) {
    Utils.initSpin('spin-loader');
    this.fetchArticleCategoryApi(id).then((res) => {
      if (res.code === 0){
        this.setState({articleCategoryOptions: res.data});
        if (res.data.length){
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
          } = res.data[0];
          this.setState({
            id: id,
            title: title,
            uniqueKey: uniqueKey,
            author: author,
            preface: preface,
            desc: desc,
            cover: cover,
            articleCategory: articleCategory.title,
            type: type,
            tag: tag,
            isBanned: isBanned,
            isPrivate: isPrivate,
            content: content,
          });
          this.setIsLoading(false);
        }
        else{
          this.props.setIsNotFound(true);
        }
        Utils.stopSpin('spin-loader');
      }
      else{
        if(res.msg){
          alert(res.msg);
        }
      }
    }).catch((err) => {
      // debugger;
      // alert('网络错误，请重试');
      console.log(err);
    });
  }

  fetchArticleCategoryApi(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/article_categories/' + id,
        type: 'get',
        success: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        }
      });
    })
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
      currentUser,
    } = this.props;
    let {
      isLoading,
      // isUploading,
      // id,
      title,
      uniqueKey,
      author,
      preface,
      desc,
      cover,
      articleCategory,
      // type,
      tag,
      isBanned,
      isPrivate,
      // content,
      // articleCategoryOptions,
    } = this.state;
    if (isNotFound){
      contentHtml = (<NotFound />);
    }
    else{

      let LANG_NAV = require('../../../../../locales/' + locale + '/nav');
      let LANG_ARTICLE = require('../../../../../locales/' + locale + '/article');
      let LANG_ACTION = require('../../../../../locales/' + locale + '/action');
      let editArticleCategoryButton;

      let coverHtml;
      if (cover != ''){
        // coverHtml = <img className="" src={`${cover}?imageView/1/w/${300}/h/${300}`} style={{'width':'100%'}} onLoad={this.handleImageLoaded.bind(this)}/>;
        coverHtml = <img className="" src={`${cover}`} style={{'width':'100%'}} onLoad={this.handleImageLoaded.bind(this)}/>;
      }
      else{
        coverHtml = <span className="icon icon-sentiment-satisfied"></span>;
      }
      if (!isLoading){
        if (!_.isNull(currentUser) && currentUser.role == 'admin'){
          editArticleCategoryButton = (
            <div className="my-button my-button--blue" onClick={this.go.bind(this, '/article_categories/' + uniqueKey + '/edit')}>{LANG_ACTION['edit']}{LANG_NAV['articleCategory']}</div>
          );
        }
        contentHtml = (
          <div className="page-content article background-white">
            <MobileNav isIndex={false} activeTab="article"/>
            <Nav isIndex={false} activeTab="article"/>
            <div className="core-content background-white">
              <div className="core">
                <div className="my-button my-button--red mgr-10" onClick={this.go.bind(this, '/article_categories/')}>{LANG_NAV['back']}</div>
                {editArticleCategoryButton}
                <div className="mgt-10">
                  <div className="cover-wrapper">{coverHtml}</div>
                  <div className="row-wrapper">
                    {title}
                  </div>
                  <div className="row-wrapper">
                    {author}
                  </div>
                  <div className="row-wrapper">
                    {preface}
                  </div>
                  <div className="row-wrapper">
                    {desc}
                  </div>
                  <div className="row-wrapper">
                    {articleCategory}
                  </div>
                  <div className="row-wrapper">
                    {tag}
                  </div>
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
    isNotFound,
    currentUser,
  } = state;
  return {
    locale,
    isNotFound,
    currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setIsNotFound: (val) => {
      dispatch(setIsNotFound(val));
    },
  };
}

ArticleCategory.contextTypes = {
  router: React.PropTypes.object
};

ArticleCategory.propTypes = {
  params: React.PropTypes.object,
  location: React.PropTypes.object,
  isLoading: React.PropTypes.bool,
  isNotFound: React.PropTypes.bool,
  locale: React.PropTypes.string,
  currentUser: React.PropTypes.object,
  setIsNotFound: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleCategory);