import React, { Component } from 'react';
import _ from 'lodash';

class ArticleItem extends Component {

  constructor(props) {
    super(props);
  }

  setIsLoading(bool) {
    this.setState({isLoading: bool});
  }

  componentDidMount() {

  }

  go(url) {
    this.context.router.push(url);
  }

  fetchArticleList(nextPage) {
    this.props.fetchArticleList(nextPage);
  }

  createContent() {
    return {__html: this.props.content};
  }

  go(id){
    this.props.go('/articles/' + id);
  }

  remove(id, e){
    this.props.remove(id);
    e.stopPropagation();
  }

  render() {
    let {
      locale,
      id,
      title,
      uniqueKey,
      author,
      preface,
      desc,
      cover,
      type,
      isShow,
      createdAt,
      updatedAt,
      createdBy,
      updatedBy,
      currentUser,
    } = this.props;
    let trashHtml;
    let LANG_USER = require('../../../../../../locales/' + locale + '/user');
    if (!_.isNull(currentUser) && currentUser.role == 'admin'){
      trashHtml = (
        <div className="trash" onClick={this.remove.bind(this, id)}><span className="icon icon-trash"></span></div>
      );
    }
    return(
      <div className="article-item box mgb-10" onClick={this.go.bind(this, uniqueKey)}>
        <div className="article-item__title">{title}</div>
        <div className="article-item__author">{author}</div>
        {preface != '' ? <div className="article-item__preface">{preface}</div> : ''}
        {desc != '' ? <div className="article-item__desc">{desc}</div> : ''}
        {cover != '' ? <div className="article-item__image"><img className="article-item__img" src={cover} /></div> : ''}
        <div className="article-item__content" dangerouslySetInnerHTML={this.createContent()}></div>
        {trashHtml}
      </div>
    );
  }
}

ArticleItem.propTypes = {
  locale: React.PropTypes.string,
  id: React.PropTypes.string,
  title: React.PropTypes.string,
  uniqueKey: React.PropTypes.string,
  author: React.PropTypes.string,
  preface: React.PropTypes.string,
  desc: React.PropTypes.string,
  content: React.PropTypes.string,
  cover: React.PropTypes.string,
  type: React.PropTypes.string,
  isShow: React.PropTypes.bool,
  createdAt: React.PropTypes.string,
  updatedAt: React.PropTypes.string,
  createdBy: React.PropTypes.string,
  updatedBy: React.PropTypes.string,
};

export default ArticleItem;