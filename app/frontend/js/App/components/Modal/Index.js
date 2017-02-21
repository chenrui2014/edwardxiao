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
      className,
    } = this.props;
    let title;
    let Component = MODAL_CONTENT_COMPONENT_OBJECT[modalContentName];
    if (!className){
      className = '';
    }
    return(
      <div className={`modal fade ${className}`} id="myModal" tabIndex="-1" role="dialog" aria-hidden="true">
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
  router: React.PropTypes.object
};

Modal.propTypes = {
  modalContentName: React.PropTypes.string,
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);