import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  fetchArticleList,
  setArticleList,
  setIsNotFound,
} from '../../actions/index';

import Utils from '../../../common/utils';

import MobileNav from '../../components/MobileNav/index';
import Nav from '../../components/Nav/index';
import Footer from '../../components/Footer/index';
import NotFound from '../NotFound';
import '../../../../css/articles.css';
import ArticleItem from './components/ArticleItem';

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
    this.props.fetchArticleList(this.props.articleListCurrentPage + 1);
    if (!_.isNull(this.props.articleList)){
      this.setState({isLoading: false});
    }
  }

  componentDidUpdate(prevProps) {
    if (_.isNull(prevProps.articleList) && !_.isNull(this.props.articleList)){
      this.setState({isLoading: false});
    }
    // if (!_.isNull(prevProps.articleList)){
    //   if (prevProps.articleList != this.props.articleList){
    //     this.props.fetchArticleList(this.props.articleListCurrentPage + 1);
    //   }
    // }
  }

  go(url) {
    this.context.router.push(url);
  }

  remove(id) {
    Utils.initSpin('spin-loader');
    this.removeApi(id).then((res) => {
      console.log(res);
      if (res.code === 0){
        let newArticleList = [];
        this.props.articleList.map((item, key) => {
          if (item.id != res.id){
            newArticleList.push(item);
          }
        });
        this.props.setArticleList(newArticleList);
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

  removeApi(id) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/api/articles/' + id,
        type: 'delete',
        success: (data) => {
          resolve(data);
        },
        error: (error) => {
          reject(error);
        }
      });
    })
  }

  fetchArticleList(nextPage) {
    this.props.fetchArticleList(nextPage);
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
            <div className="my-button my-button--blue" onClick={this.go.bind(this, '/articles/new')}>{LANG_ACTION['add']}{LANG_NAV['article']}</div>
          );
        }
        if (articleList.length){
          articleListHtml = articleList.map((item, key) => {
            return (
              <ArticleItem
                locale={locale}
                id={item.id}
                title={item.title}
                author={item.author}
                preface={item.preface}
                desc={item.desc}
                content={item.content}
                cover={item.cover}
                type={item.type}
                isShow={item.isShow}
                createdAt={item.createdAt}
                updatedAt={item.updatedAt}
                createdBy={item.createdBy}
                updatedBy={item.updatedBy}
                go={this.go.bind(this)}
                remove={this.remove.bind(this)}
                userInfo={userInfo}
              />
            );
          });
        }
      }
      let backUrl = this.state.backUrl;
      content = (
        <div className="page-content background-white">
          <MobileNav isIndex={false} activeTab="articles"/>
          <Nav isIndex={false} activeTab="articles"/>
          <div className="core-content">
            <div className="core">
              {newArticleButton}
              {articleListHtml}
              <div className="push"></div>
            </div>
          </div>
          <Footer/>
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
    articleListCurrentPage,
    articleListTotalPage,
  } = state;
  return {
    locale,
    articleList,
    isNotFound,
    userInfo,
    articleListCurrentPage,
    articleListTotalPage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchArticleList: (nextPage) => {
      dispatch(fetchArticleList(nextPage));
    },
    setArticleList: (articleList) => {
      dispatch(setArticleList(articleList));
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
  articleListCurrentPage: React.PropTypes.number.isRequired,
  articleListTotalPage: React.PropTypes.number.isRequired,
  articleList: React.PropTypes.array.isRequired,
  fetchArticleList: React.PropTypes.func.isRequired,
  setIsNotFound: React.PropTypes.func.isRequired,
  setArticleList: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);