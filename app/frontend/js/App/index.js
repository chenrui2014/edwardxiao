import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import 'fullpage.js/dist/jquery.fullpage.min.js';
import {
  changeLocale,
} from './actions/index';

import Nav from './components/Nav/index';
import MobileNav from './components/MobileNav/index';
import AccountModal from './components/AccountModal/index';
import Utils from '../common/utils';

class Index extends Component {

  constructor(props) {
    super(props);
  }

  setIsLoading(bool) {
    this.setState({isLoading: bool});
  }

  componentWillMount() {
    Utils.initSpin('spin-loader');
  }

  componentDidMount() {
    this.initFullpage();
  }

  componentDidUpdate(){

  }

  componentWillReceiveProps(nextProps) {

  }

  initFullpage(){
    $('#fullpage').fullpage({
      sectionsColor: ['#f8f8f8', '#ececec', '#f8f8f8', '#ececec'],
      menu: '.menu',
      navigation: true,
      navigationPosition: 'right',
      onLeave: () => {
        $('.mo-nav-mobile__mask').click();
      },
      afterLoad: (anchorLink, index) => {
        $('#fullpage').addClass('visible');
        $('.fade').removeClass('visible');
        $('.section-' + index + ' .fade').addClass('visible');
      },
    });
  }

  render() {
    let {
      locale,
    } = this.props;
    let content = (
      <div className="container-full">
        <MobileNav/>
        <Nav/>
        <div id="fullpage">
          <div className="section intros" data-anchor="intros">
          </div>
          <div className="section design" data-anchor="designs">
            <div className="slide"> Slide 1 </div>
            <div className="slide"> Slide 2 </div>
            <div className="slide"> Slide 3 </div>
            <div className="slide"> Slide 4 </div>
          </div>
          <div className="section article" data-anchor="articles">
          </div>
          <div className="section contact" data-anchor="contacts">
          </div>
        </div>
        <AccountModal/>
      </div>
    );
    return(
      <div className="page">
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  let {
    locale,
    userInfo,
  } = state;
  return {
    locale,
    userInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeLocale: (val) => {
      dispatch(changeLocale(val));
    }
  };
}

Index.propTypes = {
  changeLocale: React.PropTypes.func.isRequired,
  locale: React.PropTypes.string.isRequired,
  userInfo: React.PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);