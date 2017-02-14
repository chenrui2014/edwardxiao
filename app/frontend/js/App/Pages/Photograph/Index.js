import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Utils from '../../../common/Utils';
import Portfolio from '../../components/Portfolio';
import {
  fetchArticleList,
} from '../../actions/index';

class Photograph extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }
  }

  componentDidMount(){
    this.props.fetchArticleList(1, 'photograph', 'portfolio');
    if (!_.isNull(this.props.articleList)){
      this.setState({isLoading: false});
    }
  }

  componentDidUpdate(prevProps){
    if (_.isNull(prevProps.articleList) && !_.isNull(this.props.articleList)){
      this.setState({isLoading: false});
    }
  }

  closeSlideModal() {
    $('.slide-modal').removeClass('visible');
  }

  render() {
    let {
      locale,
      articleList,
    } = this.props;
    let LANG_USER = require('../../../../../locales/' + locale + '/user');
    let LANG_ACTION = require('../../../../../locales/' + locale + '/action');
    let LANG_MESSAGE = require('../../../../../locales/' + locale + '/message');

    let {
      isLoading
    } = this.state;
    let contentHtml;
    if (!isLoading){
      contentHtml = (
        <Portfolio
          locale={locale}
          list={articleList}
        />);
    }
    return(
      <div>{contentHtml}</div>
    );
  }
}

function mapStateToProps(state) {
  let {
    locale,
    articleList,
  } = state;
  return {
    locale,
    articleList,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    fetchArticleList: (page, category, articleType) => {
      dispatch(fetchArticleList(page, category, articleType));
    },
  };
}

Photograph.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Photograph.propTypes = {
  locale: React.PropTypes.string.isRequired,
  articleList: React.PropTypes.array.isRequired,
  fetchArticleList: React.PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Photograph);