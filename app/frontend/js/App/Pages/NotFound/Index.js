import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import MobileNav from '../../components/MobileNav/Index';
import Nav from '../../components/Nav/Index';

class NotFound extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    if (window){
      require('../../../../css/not_found.css');
    }
  }

  go() {
    this.context.router.push('/');
  }

  render() {
    let {
      locale,
    } = this.props;
    let LANG_MESSAGE = require('../../../../../locales/' + locale + '/message');
    let LANG_ACTION = require('../../../../../locales/' + locale + '/action');
    return(
      <div className="page-content fullpage-grey-4a">
        <MobileNav isIndex={false}/>
        <Nav isIndex={false}/>
        <div className="core-content no-padding no-margin height-100pc">
          <div className="page al-center dp-tbl width-100pc">
            <div className="page-404 dp-tbl-cel middle">
              <span className="icon icon-sentiment-dissatisfied"></span>
              <div className="text-404">404</div>
              <div className="fts-16 mgt-40 mgb-10">
                {LANG_MESSAGE['not-found-message']}
              </div>
              <div className="page-404__button my-button my-button--gray-border" onClick={this.go.bind(this)}>
                {LANG_ACTION['go-back']}
              </div>
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
  } = state;
  return {
    locale,
  };
}

function mapDispatchToProps() {
  return {};
}

NotFound.contextTypes = {
  router: React.PropTypes.object
};

Nav.propTypes = {
  locale: React.PropTypes.string,
}

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);