import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
  SLIDE_MODAL_CONTENT_COMPONENT_OBJECT,
} from '../../reducers/ConstValue';

class Modal extends Component {

  constructor(props) {
    super(props);
  }

  closeSlideModal() {
    $('.slide-modal').removeClass('visible');
  }

  render() {
    let {
      slideModalContentName,
      className,
    } = this.props;
    let title;
    console.log(slideModalContentName);
    let Component = SLIDE_MODAL_CONTENT_COMPONENT_OBJECT[slideModalContentName];
    if (!className){
      className = '';
    }
    return(
      <div className={`slide-modal ${className}`} id="mySlideModal" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="wrapper">
          <div className="close-wrapper">
            <div className="close" onClick={this.closeSlideModal.bind(this)}><span className="icon icon-highlight-off"></span></div>
          </div>
          <Component/>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let {
    slideModalContentName,
  } = state;
  return {
    slideModalContentName,
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
  slideModalContentName: React.PropTypes.bool.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);