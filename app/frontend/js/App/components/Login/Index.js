import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Validator from '../../../common/my_validator';
let validator = new Validator();

import {
  login,
  setIsLogin,
} from '../../actions/index';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  setUsername(){
    let username = this.refs.username.value;
    this.setState({username});
  }

  setPassword(){
    let password = this.refs.password.value;
    this.setState({password});
  }

  setIsLogin(val){
    this.props.setIsLogin(val);
  }

  login(e){
    if (validator.isValidForm($('#login'))){
      let {
        username,
        password,
      } = this.state;
      this.props.login(username, password);
    }
    e.preventDefault();
  }

  render() {
    let {
      locale,
    } = this.props;
    let {
      username,
      password,
    } = this.state;
    let LANG_USER = require('../../../../../locales/' + locale + '/user');
    return(
      <div className="modal-content">
        <div className="modal-header">
          <span className="modal-title" id="exampleModalLabel">{LANG_USER.login}</span>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form className="login" id="login" onSubmit={this.login.bind(this)}>
            <div className="input-wapper">
            <div className="input-group width-100pc">
              <input
                type="text"
                id="username"
                ref="username"
                className="form-control input-sm"
                value={username}
                data-my-validator="true"
                data-my-validator-required="true"
                data-my-validator-name=""
                data-my-validator-type="text"
                placeholder={LANG_USER.username}
                style={{'float':'none','display':'inline-block'}}
                onChange={this.setUsername.bind(this)}
              />
            </div>
            <div className="input-group width-100pc">
              <input
                type="password"
                id="password"
                ref="password"
                className="form-control input-sm"

                data-my-validator="true"
                data-my-validator-required="true"
                data-my-validator-name=""
                data-my-validator-min-length="6"
                data-my-validator-max-length="20"
                data-my-validator-type="password"
                placeholder={LANG_USER.password}
                style={{'float':'none','display':'inline-block'}}
                onChange={this.setPassword.bind(this)}
              />
            </div>
            </div>
            <input type="submit" className="hidden"/>
          </form>
        </div>
        <div className="modal-footer">
          <div className="my-button my-button--blue width-100pc" onClick={this.login.bind(this)}>{LANG_USER.login}</div>
          <div className="height-15"></div>
          <div className="border-h"></div>
          <div className="height-15"></div>
          <div className="my-button my-button--red width-100pc" onClick={this.setIsLogin.bind(this, false)}>{LANG_USER.signup}</div>
        </div>
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
    login: (username, password) => {
      dispatch(login(username, password));
    },
    setIsLogin: (val) => {
      dispatch(setIsLogin(val));
    },
  };
}

Login.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Login.propTypes = {
  locale: React.PropTypes.string.isRequired,
  login: React.PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);