import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Utils from '../../../common/Utils';
import Validator from '../../../common/my_validator';
let validator = new Validator();

import {
  signup,
  remove,
  fetchVerifyCode,
  changeCaptcha,
} from '../../actions/index';

class Portfolio extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  closeSlideModal() {
    $('.slide-modal').removeClass('visible');
  }

  render() {
    let {
      locale,
    } = this.props;
    let LANG_USER = require('../../../../../locales/' + locale + '/user');
    let LANG_ACTION = require('../../../../../locales/' + locale + '/action');
    let LANG_MESSAGE = require('../../../../../locales/' + locale + '/message');
    return(
      <div className="modal-content">
        <div className="close" onClick={this.closeSlideModal.bind(this)}><span className="icon icon-highlight-off"></span></div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let {
    locale,
  } = state;
  return {
    locale,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    signup: (id, nickname, role, phone, email, verifyCode, password, avatar, captchaCode) => {
      dispatch(signup(id, nickname, role, phone, email, verifyCode, password, avatar, captchaCode));
    },
  };
}

Portfolio.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Portfolio.propTypes = {
  locale: React.PropTypes.string.isRequired,
  changeCaptcha: React.PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);