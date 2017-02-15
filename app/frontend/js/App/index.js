import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import 'fullpage.js/dist/jquery.fullpage.min.js';
import 'fullpage.js/vendors/scrolloverflow.min.js';
import {
  setPortfolioType,
  setSlideModalContentName,
} from './actions/index';

import Nav from './components/Nav/index';
import MobileNav from './components/MobileNav/index';

import Utils from '../common/utils';

class Index extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
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
      sectionsColor: ['#f8f8f8', '#ececec', '#f8f8f8', '#ececec', '#f8f8f8'],
      menu: '.menu',
      navigation: false,
      navigationPosition: 'right',
      slidesNavigation: true,
      slidesNavPosition: 'bottom',
      scrollOverflow: false,
      // normalScrollElements: '.slide-modal',
      onLeave: (index, nextIndex) => {
        $('.mo-nav-mobile__mask').click();
      },
      onSlideLeave: (anchorLink, index, slideIndex, direction, nextSlideIndex) => {
        if(nextSlideIndex == 1){
          $('.logo-design').addClass('visible');
        }
        if(nextSlideIndex == 2){
          $('.industrial-design').addClass('visible');
        }
        if(nextSlideIndex == 3){
          $('.web-design').addClass('visible');
        }
        if(nextSlideIndex == 4){
          $('.photograph').addClass('visible');
        }
      },
      afterLoad: (anchorLink, index) => {
        $('.fullpage-wrapper').addClass('visible');
        $('.section-' + index + ' .fade').addClass('visible');
        if (index == 1){
          if (!$('.intros').hasClass('visible')){
            Utils.initSpin('spin-loader');
              setTimeout(() => {
              $('.intros').addClass('visible');
              Utils.stopSpin('spin-loader');
              return;
            }, 800);
          }
        }
        if (index == 2){
          if (!$('.graphic-design').hasClass('visible')){
            Utils.initSpin('spin-loader');
              setTimeout(() => {
              $('.graphic-design').addClass('visible');
              Utils.stopSpin('spin-loader');
              return;
            }, 800);
          }
        }
        if (index == 3){
          if (!$('.article').hasClass('visible')){
            Utils.initSpin('spin-loader');
              setTimeout(() => {
              $('.article').addClass('visible');
              Utils.stopSpin('spin-loader');
              return;
            }, 800);
          }
        }
        if (index == 4 || index == 5){
          if (!$('.contact').hasClass('visible')){
            Utils.initSpin('spin-loader');
              setTimeout(() => {
              $('.contact').addClass('visible');
              Utils.stopSpin('spin-loader');
              return;
            }, 800);
          }
        }
      },
    });
  }

  setSlideModalContentName(val){
    $.fn.fullpage.setAllowScrolling(false);
    $('.slide-modal').addClass('visible');
    this.props.setPortfolioType(val);
    this.props.setSlideModalContentName('Portfolio');
  }

  readMore(){
    $.fn.fullpage.moveSectionDown();
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
            <div className="title" onClick={this.readMore.bind(this)}><div className="dp-inline-block middle"><span className="text">{LANG_GENERAL['read-more']}</span></div>&nbsp;<div className="dp-inline-block middle"><div className="arrow-down-wrapper"><span className="icon icon-expand-more"></span></div></div></div>
          </div>
          <div className="section design" data-anchor="designs">
            <div className="slide graphic-design">
              <div className="spin-loader" id="graphic-design-loader"></div>
              <div className="title" onClick={this.setSlideModalContentName.bind(this, 'graphic_design')}><span className="text">{LANG_GENERAL['graphic-design']}</span><span className="icon icon-more"></span></div>
            </div>
            <div className="slide logo-design">
              <div className="spin-loader" id="logo-design-loader"></div>
              <div className="title" onClick={this.setSlideModalContentName.bind(this, 'logo_design')}><span className="text">{LANG_GENERAL['logo-design']}</span><span className="icon icon-more"></span></div>
            </div>
            <div className="slide industrial-design">
              <div className="spin-loader" id="industrial-design-loader"></div>
              <div className="title" onClick={this.setSlideModalContentName.bind(this, 'industrial_design')}><span className="text">{LANG_GENERAL['industrial-design']}</span><span className="icon icon-more"></span></div>
            </div>
            <div className="slide web-design">
              <div className="spin-loader" id="web-design-loader"></div>
              <div className="title" onClick={this.setSlideModalContentName.bind(this, 'web_design')}><span className="text">{LANG_GENERAL['web-design']}</span><span className="icon icon-more"></span></div>
            </div>
            <div className="slide photograph">
              <div className="spin-loader" id="photograph-loader"></div>
              <div className="title" onClick={this.setSlideModalContentName.bind(this, 'photograph')}><span className="text">{LANG_GENERAL['photograph']}</span><span className="icon icon-more"></span></div>
            </div>
          </div>
          <div className="section article" data-anchor="articles">
            <div className="title"><span className="text" onClick={this.go.bind(this, 'articles')}>{LANG_GENERAL['read-article']}</span><span className="icon icon-more"></span></div>
          </div>
          <div className="section contact" data-anchor="contacts">
            <div className="contact-content">
              <div className="row">
                <div className="col-md-4 col-xs-4">
                  <a href="https://github.com/edwardfhsiao"><div className="contact-icon-wrapper"><span className="icon fa fa-github-alt" aria-hidden="true"></span></div></a>
                </div>
                <div className="col-md-4 col-xs-4">
                  <a href="https://www.facebook.com/edward.hsiao.98"><div className="contact-icon-wrapper"><span className="icon fa fa-facebook" aria-hidden="true"></span></div></a>
                </div>
                <div className="col-md-4 col-xs-4">
                  <a href="http://weibo.com/fourit"><div className="contact-icon-wrapper"><span className="icon fa fa-weibo" aria-hidden="true"></span></div></a>
                </div>
              </div>
              <div className="title mgt-20"><span className="fa fa-envelope"></span>&nbsp;<span className="text"><a className="white" href="mailto:edwardfhsiao@gmail.com">edwardfhsiao@gmail.com</a></span></div>
            </div>
          </div>
          <div className="section fp-auto-height footer" data-anchor="footer">
            <div className="copyright al-center">Copyright © Edward Xiao</div>
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
    setPortfolioType: (val) => {
      dispatch(setPortfolioType(val));
    },
    setSlideModalContentName: (val) => {
      dispatch(setSlideModalContentName(val));
    },
  };
}

Index.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Index.propTypes = {
  setPortfolioType: React.PropTypes.func.isRequired,
  setSlideModalContentName: React.PropTypes.func.isRequired,
  locale: React.PropTypes.string.isRequired,
  userInfo: React.PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);