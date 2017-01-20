import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Login from '../Login/index';
import Signup from '../Signup/index';

class AccountModal extends Component {

  constructor(props) {
    super(props);
  }

  changeLocale(){
    let val = this.refs.locale.value;
    this.props.changeLocale(val);
  }

  render() {
    let {
      locale,
      isLogin,
    } = this.props;
    let LANG = require('../../../../../locales/' + locale);
    let title;
    let content;
    if (isLogin){
      title = LANG.users.login;
      content = <Login/>;
    }
    else{
      title = LANG.users.signup;
      content = <Signup/>;
    }
    return(
      <div className="modal fade" id="accountModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title" id="exampleModalLabel">{title}</span>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {content}
            </div>
            <div className="modal-footer">
              <div className="my-button my-button--gray-border mgr-10" data-dismiss="modal">{LANG.actions.cancel}</div>
              <div className="my-button my-button--blue">{LANG.actions.confirm}</div>
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
    isLogin,
  } = state;
  return {
    locale,
    isLogin,
  };
}
function mapDispatchToProps(dispatch) {
  return {

  };
}

AccountModal.contextTypes = {
  router: React.PropTypes.object.isRequired
};

AccountModal.propTypes = {
  locale: React.PropTypes.string.isRequired,
  isLogin: React.PropTypes.bool.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountModal);