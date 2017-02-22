import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import {
  fetchArticleCategoryList,
  setArticleCategoryList,
  setIsNotFound,
} from '../../actions/index';

import Utils from '../../../common/utils';

import MobileNav from '../../components/MobileNav/Index';
import Nav from '../../components/Nav/Index';
import Footer from '../../components/Footer/Index';
import NotFound from '../NotFound/Index';
import '../../../../css/articles.css';
import ArticleCategoryItem from './components/ArticleCategoryItem';

class ArticleCategoryList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }
  }

  setIsLoading(bool) {
    this.setState({isLoading: bool});
  }

  componentDidMount() {
    let currentUser = this.props.currentUser;
    if (!_.isNull(currentUser) && currentUser.role == 'admin'){
      this.props.fetchArticleCategoryList(1);
      if (!_.isNull(this.props.articleCategoryList)){
        this.setState({isLoading: false});
      }
    }
    else{
      this.props.setIsNotFound(true);
    }
  }

  componentDidUpdate(prevProps) {
    if (_.isNull(prevProps.articleCategoryList) && !_.isNull(this.props.articleCategoryList)){
      this.setState({isLoading: false});
    }
    // if (!_.isNull(prevProps.articleCategoryList)){
    //   if (prevProps.articleCategoryList != this.props.articleCategoryList){
    //     this.props.fetchArticleCategoryList(this.props.articleCategoryListCurrentPage + 1);
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
        let newArticleCategoryList = [];
        this.props.articleCategoryList.map((item) => {
          if (item.id != res.id){
            newArticleCategoryList.push(item);
          }
        });
        this.props.setArticleCategoryList(newArticleCategoryList);
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
        url: '/api/article_categories/' + id,
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

  handlePageClick(data){
    this.props.fetchArticleCategoryList(data.selected + 1);
  }

  render() {
    let content;
    let {
      locale,
      isNotFound,
      articleCategoryList,
      articleCategoryListTotalPage,
      articleCategoryListCurrentPage,
      currentUser,
    } = this.props;
    let {
      isLoading
    } = this.state;
    if (isNotFound){
      content = (<NotFound />);
    }
    else{
      let LANG_ACTION = require('../../../../../locales/' + locale + '/action');
      let LANG_NAV = require('../../../../../locales/' + locale + '/nav');
      let LANG_ARTICLE = require('../../../../../locales/' + locale + '/article');
      let articleCategoryListHtml;
      let newArticleCategoryButton;
      let paginationHtml;
      if (!isLoading){
        if (!_.isNull(currentUser) && currentUser.role == 'admin'){
          newArticleCategoryButton = (
            <div className="my-button my-button--blue" onClick={this.go.bind(this, '/article_categories/new')}>{LANG_ACTION['add']}{LANG_ARTICLE['article-category']}</div>
          );
        }
        if (articleCategoryList.length){
          articleCategoryListHtml = articleCategoryList.map((item, key) => {
            return (
              <ArticleCategoryItem
                key={key}
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
                level={item.level}
                isShow={item.isShow}
                createdAt={item.createdAt}
                updatedAt={item.updatedAt}
                createdBy={item.createdBy}
                updatedBy={item.updatedBy}
                go={this.go.bind(this)}
                remove={this.remove.bind(this)}
                currentUser={currentUser}
              />
            );
          });
          paginationHtml = (
            <ReactPaginate
              previousLabel={<span className="icon icon-chevron-left"></span>}
              nextLabel={<span className="icon icon-chevron-right"></span>}
              pageCount={articleCategoryListTotalPage}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick.bind(this)}
              containerClassName={'pagination'}
              pageClassName={'page'}
              activeClassName={'cur'}
              previousClassName={'prev'}
              nextClassName={'next'}
              forcePage={articleCategoryListCurrentPage - 1}
            />
          );
        }
      }
      content = (
        <div className="page-content background-white">
          <MobileNav isIndex={false} activeTab=""/>
          <Nav isIndex={false} activeTab=""/>
          <div className="core-content background-white">
            <div className="core">
              <div className="mgb-10">
                <div className="my-button my-button--red mgr-10" onClick={this.go.bind(this, '/articles')}>{LANG_NAV['back']}</div>
                {newArticleCategoryButton}
              </div>
              {articleCategoryListHtml}
              {paginationHtml}
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
    isNotFound,
    currentUser,
    articleCategoryListCurrentPage,
    articleCategoryListTotalPage,
  } = state;
  return {
    locale,
    articleCategoryList,
    isNotFound,
    currentUser,
    articleCategoryListCurrentPage,
    articleCategoryListTotalPage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchArticleCategoryList: (page) => {
      dispatch(fetchArticleCategoryList(page));
    },
    setArticleCategoryList: (articleCategoryList) => {
      dispatch(setArticleCategoryList(articleCategoryList));
    },
    setIsNotFound: (val) => {
      dispatch(setIsNotFound(val));
    },
  };
}

ArticleCategoryList.contextTypes = {
  router: React.PropTypes.object
};

ArticleCategoryList.propTypes = {
  params: React.PropTypes.object,
  isNotFound: React.PropTypes.bool,
  location: React.PropTypes.object,
  isLoading: React.PropTypes.bool,
  locale: React.PropTypes.string,
  currentUser: React.PropTypes.object,
  articleCategoryListCurrentPage: React.PropTypes.number,
  articleCategoryListTotalPage: React.PropTypes.number,
  articleCategoryList: React.PropTypes.array,
  fetchArticleCategoryList: React.PropTypes.func,
  setIsNotFound: React.PropTypes.func,
  setArticleCategoryList: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleCategoryList);