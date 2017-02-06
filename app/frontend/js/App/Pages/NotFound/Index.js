import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import '../../../../css/not_found.css';

class NotFound extends Component {

  constructor(props) {
    super(props);
  }

  go() {
    // this.context.router.push('/');
    // this.context.router.goSmartBack();
    // let {
    //   userInfo
    // } = this.props;
    // let url;
    // if (!_.isNull(userInfo) && userInfo.merchants.length){
    //   url = '/my_merchant/' + userInfo.merchants[0].id;
    // }
    // else{
    //   url = '/my_activity_list';
    // }
    this.context.router.push('/');
  }

  render() {
    return(
      <div className='page al-center'>
        <div className="page-404">
          <div>
            <img src={require('../../../../img/404.png')} srcSet={require('../../../../img/404@2x.png')} className="page-404__image" />
          </div>
          <div className="fts-16 al-left mgt-40 mgb-10">
            出错啦！
          </div>
          <div className="grey-72 al-left mgb-40">
            您访问的页面不存在
          </div>
          <div className="page-404__button yl-button yl-button--red" onClick={this.go.bind(this)}>
            立即返回
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userInfo: state.userInfo
  };
}

function mapDispatchToProps() {
  return {};
}

NotFound.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);