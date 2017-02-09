import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _ from 'lodash';
import Utils from '../common/utils';
import Modal from './components/Modal/index';
import SlideModal from './components/SlideModal/index';
import {
  authorize
} from './actions/index';

class Main extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let { children, location } = this.props;
    return(
      <div className="page-transition">
        <ReactCSSTransitionGroup
          component="div"
          // transitionName={ location.action == 'PUSH' ? 'forward' : 'backward' }
          transitionName="fade"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}
        >
          {React.cloneElement(children, {
            key: location.pathname
          })}
          <Modal/>
          <SlideModal/>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authorize: (accessToken) => {
      dispatch(authorize(accessToken));
    }
  };
}


Main.propTypes = {
  children: React.PropTypes.element.isRequired,
  location: React.PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);