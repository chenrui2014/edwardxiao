import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  MODAL_CONTENT_COMPONENT_OBJECT,
} from '../../reducers/ConstValue';

class Modal extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let {
      modalContentName,
    } = this.props;
    let title;
    let Component = MODAL_CONTENT_COMPONENT_OBJECT[modalContentName];
    return(
      <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <Component/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let {
    modalContentName,
  } = state;
  return {
    modalContentName,
  };
}
function mapDispatchToProps(dispatch) {
  return {

  };
}

Modal.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Modal.propTypes = {
  modalContentName: React.PropTypes.bool.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);