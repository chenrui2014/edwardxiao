import React, { Component } from 'react';
import _ from 'lodash';
import Utils from '../../../common/Utils';
import Masonry from 'react-masonry-component';

let masonryOptions = {
    // isFitWidth: true,
};

class Portfolio extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }
  }

  componentDidMount(){
    Utils.initSpin('slide-modal-loader');
    if (this.props.list.length){
      this.props.list.map((item, key) => {Utils.initSpin(`spin-loader-${key}`);});
    }
    this.setState({isLoading: false});
  }

  // componentDidUpdate(prevProps){
  //   if (list.length){
  //     list.map((item, key) => {Utils.initSpin(`spin-loader-${key}`);});
  //   }
  // }

  componentDidUpdate(prevProps, prevState){
    if (prevState.isLoading && !this.state.isLoading){
      Utils.stopSpin('slide-modal-loader');
    }
  }

  handleImageLoaded(id, imageElementId){
    Utils.stopSpin(id);
    $('#' + imageElementId).addClass('visible');
  }

  render() {
    let {
      locale,
      list,
    } = this.props;
    let {
      isLoading
    } = this.state;
    let LANG_USER = require('../../../../../locales/' + locale + '/user');
    let LANG_ACTION = require('../../../../../locales/' + locale + '/action');
    let LANG_MESSAGE = require('../../../../../locales/' + locale + '/message');
    let content;
    let listHtml;
    if (!isLoading){
      if (list.length){
        listHtml = list.map((item, key) => {
          return (
            <div className="portfolio-item-wrapper col-lg-3 col-md-4 col-sm-6 col-xs-12" title={item.title}>
              <div className="portfolio-item">
                <div className="spin-loader" id={`spin-loader-${key}`}></div>
                <img src={`${item.cover}`} className="fade" id={`gallery-image-${key}`} onLoad={this.handleImageLoaded.bind(this, `spin-loader-${key}`, `gallery-image-${key}`)}/>
              </div>
            </div>
          );
        });
      }
      content = (
        <div className="row">
          <Masonry
            className={'portfolio-items'} // default ''
            elementType={'div'} // default 'div'
            options={{}} // default {}
            disableImagesLoaded={false} // default false
            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
          >
            {listHtml}
          </Masonry>
        </div>
      );
    }
    return(
      <div className="slide-modal-content">
        <div className="spin-loader" id="slide-modal-loader"></div>
        {content}
      </div>
    );
  }
}

Portfolio.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Portfolio.propTypes = {
  locale: React.PropTypes.string.isRequired,
  changeCaptcha: React.PropTypes.func.isRequired,
}

export default Portfolio;