import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'bootstrap-sass/assets/javascripts/bootstrap/modal.js';
import 'bootstrap-sass/assets/javascripts/bootstrap/transition.js';
import _ from 'lodash';
import {
  changeLocale,
  setModalContentName,
  logout,
} from './../../actions/index';

class Footer extends Component {

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

  handleImageLoaded(){

  }

  render() {
    let {
      locale,
      userInfo,
      className,
    } = this.props;
    if (_.isUndefined(className)){
      className = '';
    }
    let LANG_GENERAL = require('../../../../../locales/' + locale + '/general');
    let LANG_NAV = require('../../../../../locales/' + locale + '/nav');
    let LANG_USER = require('../../../../../locales/' + locale + '/user');
    return(
      <div className={`footer ${className}`}>
        footer
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
    changeLocale: (val) => {
      dispatch(changeLocale(val));
    },
    setModalContentName: (val) => {
      dispatch(setModalContentName(val));
    },
    logout: () => {
      dispatch(logout());
    },
  };
}

Footer.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Footer.propTypes = {
  locale: React.PropTypes.string.isRequired,
  userInfo: React.PropTypes.object.isRequired,
  changeLocale: React.PropTypes.func.isRequired,
  setModalContentName: React.PropTypes.func.isRequired,
  logout: React.PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);