import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import 'fullpage.js/dist/jquery.fullpage.min.js';
import 'fullpage.js/vendors/scrolloverflow.min.js';
import {
  setSlideModalContentName,
} from './actions/index';

import Nav from './components/Nav/index';
import MobileNav from './components/MobileNav/index';

import Utils from '../common/utils';

class Index extends Component {

  constructor(props) {
    super(props);
  }

  setIsLoading(bool) {
    this.setState({isLoading: bool});
  }

  componentWillMount() {
    Utils.initSpin('spin-loader');
  }

  componentDidMount() {
    if (typeof $.fn.fullpage.destroy == 'function') {
      $.fn.fullpage.destroy('all');
    }
    this.initFullpage();
  }

  componentWillUnmount(){
    if (typeof $.fn.fullpage.destroy == 'function') {
      $.fn.fullpage.destroy('all');
    }
  }

  componentDidUpdate(){

  }

  componentWillReceiveProps(nextProps) {

  }

  go(url) {
    this.context.router.push(url);
  }

  initFullpage(){
    $('#fullpage').fullpage({
      sectionsColor: ['#f8f8f8', '#ececec', '#f8f8f8', '#ececec'],
      menu: '.menu',
      navigation: false,
      navigationPosition: 'right',
      slidesNavigation: true,
      slidesNavPosition: 'bottom',
      scrollOverflow: false,
      normalScrollElements: '.slide-modal',
      onLeave: () => {
        $('.mo-nav-mobile__mask').click();
      },
      afterLoad: (anchorLink, index) => {
        $('#fullpage').addClass('visible');
        $('.fade').removeClass('visible');
        $('.section-' + index + ' .fade').addClass('visible');
      },
    });
  }

  setSlideModalContentNameName(val){
    $('.slide-modal').addClass('visible');
    this.props.setSlideModalContentName(val);
  }

  render() {
    let {
      locale,
    } = this.props;
    let articleListHtml;
    articleListHtml = (
      <Link>文章</Link>
    );
    let LANG_GENERAL = require('../../../locales/' + locale + '/general');
    let content = (
      <div className="container-full">
        <MobileNav isIndex={true}/>
        <Nav isIndex={true} className="gradient"/>
        <div id="fullpage">
          <div className="section intros" data-anchor="intros">
          </div>
          <div className="section design" data-anchor="designs">
            <div className="slide graphic-design"><div className="title" onClick={this.setSlideModalContentNameName.bind(this, 'GraphicDesign')}><span className="text">{LANG_GENERAL['graphic-design']}</span><span className="icon icon-more"></span></div></div>
            <div className="slide logo-design"><div className="title"><span className="text">{LANG_GENERAL['logo-design']}</span><span className="icon icon-more"></span></div></div>
            <div className="slide industrial-design"><div className="title"><span className="text">{LANG_GENERAL['industrial-design']}</span><span className="icon icon-more"></span></div></div>
            <div className="slide web-design"><div className="title"><span className="text">{LANG_GENERAL['web-design']}</span><span className="icon icon-more"></span></div></div>
            <div className="slide photograph"><div className="title"><span className="text">{LANG_GENERAL['photograph']}</span><span className="icon icon-more"></span></div></div>
          </div>
          <div className="section article" data-anchor="articles">
            <div className="title"><span className="text" onClick={this.go.bind(this, 'articles')}>{LANG_GENERAL['read-article']}</span><span className="icon icon-more"></span></div>
          </div>
          <div className="section contact" data-anchor="contacts">
          </div>
        </div>
      </div>
    );
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
    userInfo,
  } = state;
  return {
    locale,
    userInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSlideModalContentName: (val) => {
      dispatch(setSlideModalContentName(val));
    },
  };
}

Index.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Index.propTypes = {
  setSlideModalContentName: React.PropTypes.func.isRequired,
  locale: React.PropTypes.string.isRequired,
  userInfo: React.PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);