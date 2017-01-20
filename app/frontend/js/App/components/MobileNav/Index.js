import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  setIsLogin,
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

  setIsLogin(val){
    this.props.setIsLogin(val);
  }

  logout(){
    this.props.logout();
  }

  render() {
    let {
      locale,
      userInfo,
    } = this.props;
    let userHtml;
    let LANG = require('../../../../../locales/' + locale);
    if (_.isNull(userInfo)){
      userHtml = (
        <div className="mo-nav-column__item">
          <div className="mo-nav-column__item user-nav">
            <span className="user-nav__item cursor-pointer" data-toggle="modal" data-target="#accountModal" onClick={this.setIsLogin.bind(this, true)}>{LANG.users.login}</span>
            <span className="user-nav__item">&nbsp;/&nbsp;</span>
            <span className="user-nav__item cursor-pointer" data-toggle="modal" data-target="#accountModal" onClick={this.setIsLogin.bind(this, false)}>{LANG.users.signup}</span>
          </div>
        </div>
      );
    }
    else{
      userHtml = (
        <div className="mo-nav-column__item">
          <div className="mo-nav-column__item user-nav">
            <span className="user-nav__item cursor-pointer" data-toggle="modal" data-target="#accountModal">{userInfo.name}</span>
            <span className="user-nav__item">&nbsp;/&nbsp;</span>
            <span className="user-nav__item cursor-pointer" data-toggle="modal" data-target="#accountModal" onClick={this.logout.bind(this, false)}>{LANG.users.logout}</span>
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
                <a className="mo-nav-column__item" href="#intros" data-menuanchor="intros">
                  <div className="nav-item-wrapper">
                    <div className="mgt-10">
                      {LANG.nav.home}
                    </div>
                  </div>
                </a>
                <a className="mo-nav-column__item" href="#designs" data-menuanchor="designs">
                  <div className="nav-item-wrapper">
                    <div className="mgt-10">
                      {LANG.nav.portfolio}
                    </div>
                  </div>
                </a>
                <a className="mo-nav-column__item" href="#articles" data-menuanchor="articles">
                  <div className="nav-item-wrapper">
                    <div className="mgt-10">
                      {LANG.nav.article}
                    </div>
                  </div>
                </a>
                <a className="mo-nav-column__item" href="#contacts" data-menuanchor="contacts">
                  <div className="nav-item-wrapper">
                    <div className="mgt-10">
                      {LANG.nav.contact}
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
    setIsLogin: (val) => {
      dispatch(setIsLogin(val));
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
  setIsLogin: React.PropTypes.func.isRequired,
  logout: React.PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);