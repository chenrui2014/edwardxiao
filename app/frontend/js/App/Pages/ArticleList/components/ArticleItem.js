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
      userInfo,
    } = this.props;
    let trashHtml;
    let LANG_USER = require('../../../../../../locales/' + locale + '/user');
    if (!_.isNull(userInfo) && userInfo.role == 'admin'){
      trashHtml = (
        <div className="trash" onClick={this.remove.bind(this, id)}><span className="icon icon-trash"></span></div>
      );
    }
    return(
      <div className="article-item box mgb-10" onClick={this.go.bind(this, uniqueKey)}>
        <div className="article-item__title">{title}</div>
        <div className="article-item__preface">{preface}</div>
        <div className="article-item__desc">{desc}</div>
        {cover != '' ? <div className="article-item__image"><img className="article-item__img" src={cover} /></div> : ''}
        <div className="article-item__content" dangerouslySetInnerHTML={this.createContent()}></div>
        {trashHtml}
      </div>
    );
  }
}

ArticleItem.propTypes = {
  locale: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  uniqueKey: React.PropTypes.string.isRequired,
  author: React.PropTypes.string.isRequired,
  preface: React.PropTypes.string.isRequired,
  desc: React.PropTypes.string.isRequired,
  content: React.PropTypes.string.isRequired,
  cover: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  isShow: React.PropTypes.bool.isRequired,
  createdAt: React.PropTypes.string.isRequired,
  updatedAt: React.PropTypes.string.isRequired,
  createdBy: React.PropTypes.string.isRequired,
  updatedBy: React.PropTypes.string.isRequired,
};

export default ArticleItem;