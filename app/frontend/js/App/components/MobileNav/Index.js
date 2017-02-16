import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  setModalContentName,
  logout,
} from './../../actions/index';

class Nav extends Component {

  constructor(props) {
    super(props);
  }

  changeLocale(){
    let val = this.refs.locale.value;
    this.props.changeLocale(val);
  }

  setModalContentName(val){
    this.props.setModalContentName(val);
  }

  logout(){
    this.props.logout();
  }

  render() {
    let {
      locale,
      userInfo,
      isIndex,
      activeTab,
    } = this.props;
    let userHtml;
    let LANG_NAV = require('../../../../../locales/' + locale + '/nav');
    let LANG_USER = require('../../../../../locales/' + locale + '/user');
    if (_.isNull(userInfo)){
      userHtml = (
        <div className="mo-nav-column__item">
          <div className="mo-nav-column__item user-nav">
            <span className="user-nav__item cursor-pointer" data-toggle="modal" data-target="#myModal" onClick={this.setModalContentName.bind(this, 'Login')}>{LANG_USER.login}</span>
            <span className="user-nav__item">&nbsp;/&nbsp;</span>
            <span className="user-nav__item cursor-pointer" data-toggle="modal" data-target="#myModal" onClick={this.setModalContentName.bind(this, 'Signup')}>{LANG_USER.signup}</span>
          </div>
        </div>
      );
    }
    else{
      userHtml = (
        <div className="mo-nav-column__item">
          <div className="mo-nav-column__item user-nav">
            <span className="user-nav__item cursor-pointer" data-toggle="modal" data-target="#myModal">{userInfo.nickname}</span>
            <span className="user-nav__item">&nbsp;/&nbsp;</span>
            <span className="user-nav__item cursor-pointer" data-toggle="modal" data-target="#myModal" onClick={this.logout.bind(this, false)}>{LANG_USER.logout}</span>
          </div>
        </div>
      );
    }
    return(
      <div className="mo-navbar__nav-mobile mo-nav-mobile">
        <div className="mo-nav-mobile__mask"></div>
        <div className="nav__left menu">
          <div className="mo-nav-mobile__content">
            <div className="mo-nav-mobile__menu-wrapper">
                <a className="mo-nav-column__item" href="/">
                  <div className="logo"><span className="icon icon-edwardxiao"></span></div>
                </a>
                {userHtml}
                <a className={!isIndex && activeTab == 'intros' ? `mo-nav-column__item active` : `mo-nav-column__item`} href={isIndex ? `#intros` : `/`} data-menuanchor="intros">
                  <div className="nav-item-wrapper">
                    <div className="mgt-10">
                      {LANG_NAV.home}
                    </div>
                  </div>
                </a>
                <a className={!isIndex && activeTab == 'designs' ? `mo-nav-column__item active` : `mo-nav-column__item`} href={isIndex ? `#designs` : `/#designs`} data-menuanchor="designs">
                  <div className="nav-item-wrapper">
                    <div className="mgt-10">
                      {LANG_NAV.portfolio}
                    </div>
                  </div>
                </a>
                <a className={!isIndex && activeTab == 'articles' ? `mo-nav-column__item active` : `mo-nav-column__item`} href={isIndex ? `#articles` : `/articles`} data-menuanchor="articles">
                  <div className="nav-item-wrapper">
                    <div className="mgt-10">
                      {LANG_NAV.article}
                    </div>
                  </div>
                </a>
                <a className={!isIndex && activeTab == 'contacts' ? `mo-nav-column__item active` : `mo-nav-column__item`} href={isIndex ? `#contacts` : `/#contacts`} data-menuanchor="contacts">
                  <div className="nav-item-wrapper">
                    <div className="mgt-10">
                      {LANG_NAV.contact}
                    </div>
                  </div>
                </a>
            </div>
          </div>
        </div>
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
    setModalContentName: (val) => {
      dispatch(setModalContentName(val));
    },
    logout: (val) => {
      dispatch(logout(val));
    },
  };
}

Nav.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Nav.propTypes = {
  locale: React.PropTypes.string.isRequired,
  userInfo: React.PropTypes.object.isRequired,
  setModalContentName: React.PropTypes.func.isRequired,
  logout: React.PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);