import React, { Component } from 'react';

class Empty extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let { title, subTitle } = this.props;
    let subTitleHtml;
    if (subTitle) {
      subTitleHtml = (
        <div className="mo-empty__text mgt-5 fts-12 grey-72">
          {subTitle}
        </div>
      );
    }
    return(
      <div className="mo-empty al-center">
        <div>
          <img src={require('../../../../img/empty.png')} srcSet={require('../../../../img/empty@2x.png')}  className="mo-empty__img" />
        </div>
        <div className="mo-empty__text mgt-20">
          {title}
        </div>
        {subTitleHtml}
      </div>
    );
  }
}

Empty.propTypes = {
  title: React.PropTypes.string.isRequired,
  subTitle: React.PropTypes.string,
};

export default Empty;