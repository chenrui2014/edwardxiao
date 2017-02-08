import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  setIsNotFound,
} from '../../actions/index';

import Validator from '../../../common/my_validator';
let validator = new Validator();

import Utils from '../../../common/utils';

import MobileNav from '../../components/MobileNav/index';
import Nav from '../../components/Nav/index';
import Footer from '../../components/Footer/index';
import NotFound from '../NotFound';
import '../../../../css/articles.css';

class Article extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      backUrl: null,
      id: '',
      title: '',
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
      isUploading: false,
    }
  }

  setIsLoading(bool) {
    this.setState({isLoading: bool});
  }

  componentDidMount() {
    this.fetchArticle(this.props.params.id);
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevState.id == '' && this.state.id !== ''){
    //   this.setIsLoading(false);
    // }
  }

  handleImageLoaded() {
    Utils.stopSpin('cover-spin-loader');
  }

  fetchArticle(id) {
    Utils.initSpin('spin-loader');
    this.fetchArticleApi(id).then((res) => {
      console.log(res);
      if (res.code === 0){
        // console.log(res.data);
        this.setState({articleCategoryOptions: res.data});
        if (res.data.length){
          let {
            id,
            title,
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

  fetchArticleApi(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/articles/' + id,
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
      articleList,
      userInfo,
    } = this.props;
    let {
      isLoading,
      isUploading,
      id,
      title,
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
      articleCategoryOptions,
    } = this.state;
    if (isNotFound){
      contentHtml = (<NotFound />);
    }
    else{

      let LANG_NAV = require('../../../../../locales/' + locale + '/nav');
      let LANG_ARTICLE = require('../../../../../locales/' + locale + '/article');
      let LANG_ACTION = require('../../../../../locales/' + locale + '/action');
      let LANG_GENERAL = require('../../../../../locales/' + locale + '/general');
      let articleListHtml;
      let articleCategoryOptionsHtml;
      let editArticleButton;

      let coverHtml;
      if (cover != ''){
        coverHtml = <img className="" src={`${cover}?imageView/1/w/${300}/h/${300}`} style={{'width':'100%'}} onLoad={this.handleImageLoaded.bind(this)}/>;
      }
      else{
        coverHtml = <span className="icon icon-sentiment-satisfied"></span>;
      }
      if (!isLoading){
        if (!_.isNull(userInfo) && userInfo.role == 'admin'){
          editArticleButton = (
            <div className="my-button my-button--blue" onClick={this.go.bind(this, '/articles/' + id + '/edit')}>{LANG_ACTION['edit']}{LANG_NAV['article']}</div>
          );
        }
        let backUrl = this.state.backUrl;
        contentHtml = (
          <div className="page-content article background-white">
            <MobileNav isIndex={false} activeTab="articles"/>
            <Nav isIndex={false} activeTab="articles"/>
            <div className="core-content background-white">
              <div className="core">
                <div className="my-button my-button--red mgr-10" onClick={this.go.bind(this, '/articles/')}>{LANG_NAV['back-to']}{LANG_GENERAL['space-en']}{LANG_NAV['article-list']}</div>
                {editArticleButton}
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

Article.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Article.propTypes = {
  params: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  isLoading: React.PropTypes.bool.isRequired,
  locale: React.PropTypes.string.isRequired,
  userInfo: React.PropTypes.object.isRequired,
  articleList: React.PropTypes.array.isRequired,
  fetchArticleList: React.PropTypes.func.isRequired,
  setIsNotFound: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Article);