import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Validator from '../../../common/my_validator';
let validator = new Validator();

import {
  login,
} from '../../actions/index';

class AccountModal extends Component {

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
    let LANG = require('../../../../../locales/' + locale);
    return(
      <div className="modal-content">
        <div className="modal-header">
          <span className="modal-title" id="exampleModalLabel">{LANG.users.login}</span>
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
                placeholder={LANG.users.username}
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
                placeholder={LANG.users.password}
                style={{'float':'none','display':'inline-block'}}
                onChange={this.setPassword.bind(this)}
              />
            </div>
            </div>
            <input type="submit" className="hidden"/>
          </form>
        </div>
        <div className="modal-footer">
          <div className="my-button my-button--blue width-100pc" onClick={this.login.bind(this)}>{LANG.actions.confirm}</div>
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
  };
}

AccountModal.contextTypes = {
  router: React.PropTypes.object.isRequired
};

AccountModal.propTypes = {
  locale: React.PropTypes.string.isRequired,
  login: React.PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountModal);