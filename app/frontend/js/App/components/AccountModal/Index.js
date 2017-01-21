import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Login from '../Login/index';
import Signup from '../Signup/index';

class AccountModal extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let {
      isLogin,
    } = this.props;
    let title;
    let content;
    if (isLogin){
      content = <Login/>;
    }
    else{
      content = <Signup/>;
    }
    return(
      <div className="modal fade" id="accountModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          {content}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let {
    isLogin,
  } = state;
  return {
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
  isLogin: React.PropTypes.bool.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountModal);