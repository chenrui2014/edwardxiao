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

  render() {
    let {
      locale,
      id,
      title,
      author,
      preface,
      desc,
      content,
      cover,
      type,
      isShow,
      createdAt,
      updatedAt,
      createdBy,
      updatedBy,
    } = this.props;
    let LANG_USER = require('../../../../../../locales/' + locale + '/user');
    return(
      <div className="article-item">
        <div className="article-item__title">{title}</div>
        <div className="article-item__preface">{preface}</div>
        <div className="article-item__desc">{desc}</div>
        <div className="article-item__image"><img className="article-item__img" src={cover} /></div>
        <div className="article-item__content">{content}</div>
      </div>
    );
  }
}

ArticleItem.propTypes = {
  locale: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
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