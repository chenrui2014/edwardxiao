import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';


class Modal extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return(
      <div className={`modal fade ${className}`} id="myModal" tabIndex="-1" role="dialog" aria-hidden="true">
        s
      </div>
    );
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Modal);