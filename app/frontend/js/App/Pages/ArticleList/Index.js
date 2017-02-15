import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import {
  fetchArticleCategoryList,
  setArticleCategory,
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
      articleType: !_.isNull(props.userInfo) && props.userInfo.role == 'admin' ? '' : 'article',
    }
  }

  setIsLoading(bool) {
    this.setState({isLoading: bool});
  }

  componentDidMount() {
    this.props.fetchArticleCategoryList(1);
    this.props.fetchArticleList(1, this.props.articleCategory, this.state.articleType);
    if (!_.isNull(this.props.articleList)){
      this.setState({isLoading: false});
    }
  }

  componentDidUpdate(prevProps) {
    if (_.isNull(prevProps.articleList) && !_.isNull(this.props.articleList)){
      this.setState({isLoading: false});
    }
    if (_.isNull(prevProps.userInfo) && !_.isNull(this.props.userInfo)){
      if (this.props.userInfo.role == 'admin'){
        this.setState({articleType: ''});
        this.props.fetchArticleList(this.props.articleListCurrentPage + 1, this.props.articleCategory, '');
      }
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

  fetchArticleListByArticleCategory(articleCategory, articleType){
    this.props.setArticleCategory(articleCategory);
    this.props.fetchArticleList(1, articleCategory, articleType);
  }

  handlePageClick(data){
    this.props.fetchArticleList(data.selected + 1, this.props.articleCategory, this.state.articleType);
  }

  render() {
    let content;
    let {
      locale,
      isNotFound,
      articleCategoryList,
      articleCategory,
      articleList,
      articleListTotalPage,
      articleListCurrentPage,
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
      let LANG_GENERAL = require('../../../../../locales/' + locale + '/general');
      let LANG_MESSAGE = require('../../../../../locales/' + locale + '/message');
      let paginationHtml;
      let articleCategoryNavHtml;
      let articleCategoryNavListHtml;
      let articleListHtml;
      let newArticleButton;
      let newArticleCategpryButton;
      if (!isLoading){
        if (!_.isNull(userInfo) && userInfo.role == 'admin'){
          newArticleButton = (
            <div className="my-button my-button--blue mgr-10" onClick={this.go.bind(this, '/articles/new')}>{LANG_ACTION['add']}{LANG_NAV['article']}</div>
          );
          newArticleCategpryButton = (
            <div className="my-button my-button--blue" onClick={this.go.bind(this, '/article_categories')}>{LANG_NAV['article-category']}</div>
          );
        }
        if (articleCategoryList.length){
          articleCategoryNavListHtml = articleCategoryList.map((item, key) => {
            let active = false;
            if (articleCategory == item.uniqueKey){
              active = true;
            }
            return (
              <div className={active ? `article-category__item active` : `article-category__item`} onClick={this.fetchArticleListByArticleCategory.bind(this, item.uniqueKey, this.state.articleType)}>
                <span className="article-category__text">{item.title}</span>&nbsp;{active ? <span className="icon icon-check"></span> : ``}
              </div>
            );
          });
        }
        articleCategoryNavHtml = (
          <div className="box mgb-10 clearfix">
            <div className={articleCategory == 'all' ? `article-category__item active` : `article-category__item`} onClick={this.fetchArticleListByArticleCategory.bind(this, 'all', this.state.articleType)}>
              <span className="article-category__text">{LANG_GENERAL['all']}</span>&nbsp;{articleCategory == 'all' ? <span className="icon icon-check"></span> : ``}
            </div>
           {articleCategoryNavListHtml}
          </div>
        );
        if (articleList.length){
          articleListHtml = articleList.map((item, key) => {
            return (
              <ArticleItem
                locale={locale}
                id={item.id}
                title={item.title}
                uniqueKey={item.uniqueKey}
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
          paginationHtml = (
            <ReactPaginate
              previousLabel={<span className="icon icon-chevron-left"></span>}
              nextLabel={<span className="icon icon-chevron-right"></span>}
              pageCount={articleListTotalPage}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick.bind(this)}
              containerClassName={'pagination'}
              pageClassName={'page'}
              activeClassName={'cur'}
              previousClassName={'prev'}
              nextClassName={'next'}
              forcePage={articleListCurrentPage - 1}
            />
          );
        }
        else{
          articleListHtml = (
            <div className="dp-tbl al-center fts-20 box" style={{'height':'200px'}}>
              <div className="dp-tbl-cel middle">
                {LANG_MESSAGE['not-found-content']}
              </div>
            </div>
          );
        }
      }
      let backUrl = this.state.backUrl;
      content = (
        <div className="page-content background-white">
          <MobileNav isIndex={false} activeTab="articles"/>
          <Nav isIndex={false} activeTab="articles"/>
          <div className="core-content background-white">
            <div className="core">
              {!_.isNull(userInfo) && userInfo.role == 'admin' ? <div className="mobile-table article-list">
                <div className="mobile-table__cel category-nav no-mobile-990">&nbsp;</div>
                <div className="mobile-table__cel">
                {newArticleButton}
                {newArticleCategpryButton}
                </div>
              </div> : ''}
              <div className="mobile-table article-list">
                <div className="mobile-table__cel category-nav top">
                {articleCategoryNavHtml}
                </div>
                <div className="mobile-table__cel top">
                  {articleListHtml}
                  {paginationHtml}
                </div>
              </div>
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
    articleCategoryList,
    articleCategory,
    articleList,
    isNotFound,
    userInfo,
    articleCategoryListCurrentPage,
    articleListCurrentPage,
    articleListTotalPage,
  } = state;
  return {
    locale,
    articleCategoryList,
    articleCategory,
    articleList,
    isNotFound,
    userInfo,
    articleCategoryListCurrentPage,
    articleListCurrentPage,
    articleListTotalPage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchArticleCategoryList: (page) => {
      dispatch(fetchArticleCategoryList(page));
    },
    setArticleCategory: (val) => {
      dispatch(setArticleCategory(val));
    },
    fetchArticleList: (page, category, type) => {
      dispatch(fetchArticleList(page, category, type));
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
  articleCategoryListCurrentPage: React.PropTypes.number.isRequired,
  articleListCurrentPage: React.PropTypes.number.isRequired,
  articleListTotalPage: React.PropTypes.number.isRequired,
  articleCategoryList: React.PropTypes.array.isRequired,
  articleCategory: React.PropTypes.array.isRequired,
  articleList: React.PropTypes.array.isRequired,
  fetchArticleCategoryList: React.PropTypes.func.isRequired,
  fetchArticleList: React.PropTypes.func.isRequired,
  setIsNotFound: React.PropTypes.func.isRequired,
  setArticleList: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);