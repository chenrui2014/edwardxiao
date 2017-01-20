import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  fetchActivity,
  selecteDate,
  setIsNotFound,
  selectTicket,
  removeTicket,
  submitOrder,
  setSelectedTicketHash,
} from '../../actions/index';

import Swiper from 'swiper/dist/js/swiper.min.js';
import 'swiper/dist/css/swiper.min.css';

import Utils from '../../../common/utils';

import Nav from '../../components/Nav/index';
import NotFound from '../NotFound';

class Activity extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      backUrl: null,
    }
  }

  setIsLoading(bool) {
    this.setState({isLoading: bool});
  }

  componentWillMount() {
    console.log(this.props);
    Utils.initSpin('spin-loader');
    let { params } = this.props;
    let id = params.id;
    if (!Utils.isNumber(id)){
      this.props.setIsNotFound(true);
      Utils.stopSpin('spin-loader');
      return;
    }
    if (this.props.isManager){
      this.setState({backUrl: '/my_merchant_activity/' + params.merchantId + '/' +  params.activitySeriesId + '/' + params.id});
      this.props.fetchActivity(params.activityId);
    }
    else if (this.props.location.query.url){
      if (this.props.location.query.url.indexOf('/my_merchant_activity/' + params.merchantId + '/' +  params.activitySeriesId + '/' + params.id) != -1){
        this.props.fetchActivity(params.activityId);
      }
      else{
        this.props.fetchActivity(id);
      }
    }
    else if(this.props.location.pathname.indexOf('/my_merchant_activity/' + params.merchantId + '/' +  params.activitySeriesId + '/' + params.id + '/preview/') != -1){
      if (!this.props.isManager){
        this.setState({backUrl: '/my_merchant_activity/' + params.merchantId + '/' +  params.activitySeriesId + '/' + params.id});
      }
      this.props.fetchActivity(params.activityId);
    }
    else{
      this.props.fetchActivity(id);
    }
    this.props.setSelectedTicketHash({});
  }

  componentDidMount() {
    if (!_.isEmpty(this.props.activity)){
      this.initBannerSwiper();
      this.initEntriesSwiper();
    }
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps);
    if (_.isNull(this.props.activity) && !_.isNull(nextProps.activity) || !_.isNull(this.props.activity)){
      this.initBannerSwiper();
      this.setIsLoading(false);
    }
  }

  componentDidUpdate(prevProps){
    if (_.isNull(this.props.datesHash) && !_.isNull(prevProps.datesHash) || !_.isNull(this.props.datesHash)){
      this.initEntriesSwiper();
    }
    if (!this.state.isLoading){
      Utils.stopSpin('spin-loader');
    }
    else{
      Utils.initSpin('spin-loader');
    }
  }

  initBannerSwiper(){
    new Swiper('.swiper-container.banner', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        loop: true,
        onInit: function(){
          $('.swiper-container.banner').addClass('visible');
        }
    });
  }

  initEntriesSwiper(){
    new Swiper('.swiper-container.entries', {
        paginationClickable: true,
        freeMode: true,
        slidesPerView: 'auto',
        onInit: function(){
          $('.swiper-container.entries').addClass('visible');
        }
    });
  }

  selectTicket(id){
    this.props.selectTicket(id, this.props.activity.entryList);
  }

  removeTicket(id, e){
    this.props.removeTicket(id);
    e.stopPropagation();
  }

  submitOrder(){
    this.props.submitOrder();
  }

  scrollTo(id){
    Utils.scrollTo(id);
  }

  fetchActivity(id){
    this.props.fetchActivity(id);
  }

  push(url) {
    this.context.router.push(url);
  }

  selecteDate(selectedDate) {
    this.props.selecteDate(selectedDate);
  }

  showModal(id){
    Utils.showModal(id);
  }

  createMarkup(){
    return {__html: this.props.activity.content};
  }

  onMenuShareTimeline(){
    Utils.showMask();
    Utils.showShareArrow(require('../../../../img/share_arrow.png'), require('../../../../img/share_arrow@2x.png'));
  }

  onMenuShareAppMessage(){
    Utils.showShareArrow();
  }

  render() {
    let content;
    let {
      isNotFound,
      activity,
      datesHash,
      selectedDate,
      displayTicket,
      selectedTicketHash,
      isManager,
    } = this.props;
    if (_.isUndefined(isManager)){
      isManager = false;
    }
    let {
      isLoading
    } = this.state;
    if (isNotFound){
      content = (<NotFound />);
    }
    else{
      if (!isLoading){
        if (!_.isEmpty(activity)){
          let slideHtml, tagsHtml, entryOptionsContentHtml, entryOptionsHtml, ticketOptionsHtml, buyHtml;
          let { banners, tags } = activity;
          if (banners && !banners.length){
            banners[0] = require('../../../../img/activity_banner.png');
          }
          if (banners && banners.length){
            slideHtml = banners.map((item, key)=>{
              return(
                <div className="swiper-slide" key={key} ><img className="swiper-container__img" src={item}/></div>
              );
            });
          }
          if (tags && tags.length){
            tagsHtml = tags.map((item, key) => {
              return(
                <a key={key} href='#'>
                  {item}
                </a>
              );
            });
          }
          if (!_.isEmpty(datesHash)){
            let entriesNameList = [];
            for (let key in datesHash) {
              if (!datesHash.hasOwnProperty(key)) continue;
              entriesNameList.push(key);
            }
            if (entriesNameList.length){
              entryOptionsContentHtml = entriesNameList.map((item, key) => {
                let activeClass = '', entryStyle = {flex: '0 0 30%'};
                let dateHelper;
                let start_date;
                let end_date;
                // item = '11/01/2016-11/08/2016';
                if (item.indexOf('-') == -1){
                  start_date = end_date = new Date(Date.parse(item));
                }
                else{
                  let res = item.split('-');
                  start_date = new Date(Date.parse(res[0]));
                  end_date = new Date(Date.parse(res[1]));
                  entryStyle = {flex: '0 0 50%'};
                }
                let eventTime = Utils.getEventTime(start_date, end_date);
                let {
                  week,
                  dayIndicator,
                  date,
                  endDate,
                  duration
                } = eventTime;
                if (duration != 0){
                  dateHelper = '持续' + duration + '日';
                }
                else{
                  if (dayIndicator != ''){
                    dateHelper = dayIndicator;
                  }else{
                    dateHelper = week;
                  }
                }
                if (item == selectedDate){
                  activeClass = 'active';
                }
                return(
                  <div className={`mo-activity-row__object swiper-slide entry ${activeClass}`} style={entryStyle} key={key} onClick={this.selecteDate.bind(this, item)}>
                    <div className="al-center">
                      <div className={` entry-text `}>{ duration != 0 ? `${date}-${endDate}` : `${date}`}</div>
                      <div className={` entry-text `}>{ dateHelper }</div>
                    </div>
                  </div>
                );
              });
              entryOptionsHtml = (
                <div className="swiper-container entries" id="tickets">
                  <div className="swiper-wrapper">
                    {entryOptionsContentHtml}
                  </div>
                </div>
              );
              if (datesHash[selectedDate]){
                let ticketeLength = datesHash[selectedDate].length;
                let ticketsHtml, moActivityRowObjectBorderHtml;
                ticketOptionsHtml = datesHash[selectedDate].map((item, key) => {
                  let time = item.start_time.split(' ')[1];
                  let ticketeCategoriesLength = item.ticket_categories.length;
                  if (ticketeCategoriesLength){
                    if (key != ticketeLength - 1){
                      moActivityRowObjectBorderHtml = (
                        <div className="mo-activity-row__object mo-activity-row__object--border"></div>
                      );
                    }
                    ticketsHtml = item.ticket_categories.map((item, key) => {
                      let { id, name, price, remaining } = item;
                      let moTicketBorderHtml, ticketStatusHtml, quantityHtml, removeTicketHtml, priceHtml;
                      if (Utils.isNumber(selectedTicketHash[id]) && selectedTicketHash[id] > 0){
                        let quantity = selectedTicketHash[id];
                        quantityHtml = (
                          <div className="fts-12 highlight ftf-yuan">{quantity} x ¥{price}</div>
                        );
                        removeTicketHtml = (
                          <span className="icon icon-yl-remove-sign grey-9b" onClick={this.removeTicket.bind(this, id)}></span>
                        );
                      }
                      else{
                        priceHtml = (
                          <div>
                            {price != 0 ? '¥' + price : '免费'}
                          </div>
                        );
                      }
                      if (key != ticketeCategoriesLength - 1){
                        moTicketBorderHtml = (
                          <div className="grey-border"></div>
                        );
                      }
                      if (remaining <= 0){
                        ticketStatusHtml = (
                          <img className="mo-activity-ticket__sold-out" src={require('../../../../img/sold_out.png')} srcSet={require('../../../../img/sold_out@2x.png')} />
                        );
                      }
                      return(
                        <div className="mo-activity-ticket" key={key} onClick={this.selectTicket.bind(this, id)}>
                          <div className="row">
                            <div className="col-md-8 col-xs-8">
                              <div>
                                {name}
                              </div>
                              {priceHtml}
                              {quantityHtml}
                            </div>
                            <div className="col-md-4 col-xs-4 al-center col-padding-l-0">
                              {ticketStatusHtml}
                              {removeTicketHtml}
                            </div>
                          </div>
                          {moTicketBorderHtml}
                        </div>
                      );
                    });
                    return(
                      <div key={key}>
                        <div className="mo-activity-row__object row">
                          <div className="col-md-4 col-xs-4 al-center">
                            {time}
                          </div>
                          <div className="col-md-8 col-xs-8 al-left col-padding-r-0">
                            {ticketsHtml}
                          </div>
                        </div>
                        {moActivityRowObjectBorderHtml}
                      </div>
                    );
                  }
                  else{
                    return(
                      <div key={key}>
                        <div className="mo-activity-row__object row">
                          <div className="col-md-12 col-xs-12">
                            暂无相关票券信息
                          </div>
                        </div>
                      </div>
                    );
                  }
                });
              }
            }
          }
          // let myActivityId = this.props.location.query.my_activity_id;
          // let receiveTicketCode = this.props.location.query.receive_ticket_code;
          let backUrl = this.state.backUrl;
          console.log(backUrl);
          if (!isManager){
            buyHtml = (
              <div className="mo-activity-row mo-activity-row--indicator activity-operations">
                 <div className="yl-button yl-button--blue" onClick={this.onMenuShareTimeline.bind(this, 'share-modal')}>分享</div>
                 <div className="yl-button yl-button--red" onClick={this.submitOrder.bind(this)}>参加</div>
              </div>
            );
          }
          // if (backUrl)
          // if (!isManager){
          //   if (!_.isUndefined(myActivityId) && Utils.isNumber(myActivityId)) {
          //     backUrl = '/my_activity/' + myActivityId;
          //   }
          //   else if (!_.isUndefined(receiveTicketCode)){
          //     alert(receiveTicketCode);
          //     backUrl = '/receive_ticket/' + receiveTicketCode;
          //   }
          //   else{
          //     backUrl = '';
          //   }
          //   buyHtml = (
          //     <div className="mo-activity-row mo-activity-row--indicator activity-operations">
          //        <div className="yl-button yl-button--blue" onClick={this.onMenuShareTimeline.bind(this, 'share-modal')}>分享</div>
          //        <div className="yl-button yl-button--red" onClick={this.submitOrder.bind(this)}>参加</div>
          //     </div>
          //   );
          // }
          // else{
          //   backUrl = '/my_merchant_activity/' + this.props.params.merchantId + '/' + this.props.params.activitySeriesId + '/' + this.props.params.id;
          // }
          let displayTicketHtml;
          if (!_.isEmpty(displayTicket)){
            displayTicketHtml = (
              <div className="mo-activity-row__object row" onClick={this.scrollTo.bind(this, 'tickets')}>
                <div className="col-md-8 col-xs-8 al-left">
                  {displayTicket.name}
                </div>
                <div className="col-md-4 col-xs-4 al-right">
                  { displayTicket.price != 0 ? '¥' + displayTicket.price : '免费' }
                </div>
              </div>
            );
          }
          content = (
            <div className="page-content">
              <div className="slide-container">
                <Nav url={backUrl ? backUrl : ''} title={activity.title} iconClassName="white" titleClassName="white"/>
                <div className="swiper-container banner">
                  <div className="swiper-wrapper">
                    {slideHtml}
                  </div>
                  <div className="swiper-pagination"></div>
                </div>
              </div>
              <div className="mo-activity-row">
                <div className="mo-activity-row__object mo-activity-row__object--title">
                  {activity.name}
                </div>
                <div className="mo-activity-row__object mo-activity-row__object--tags highlight">
                  {tagsHtml}
                </div>
              </div>
              <div className="mo-activity-row">
                <div className="mo-activity-row__object mo-activity-row__object--title">
                  有<span className="highlight">{activity.members}</span>位爱好者参与该系列活动
                </div>
                <div className="mo-activity-row__object mo-activity-row__object--border"></div>
                {displayTicketHtml}
              </div>
              <div className="mo-activity-row ">
                <div className="mo-activity-row__object mo-activity-row__object--content-title my-grid al-center">
                  <div className="grey-border my-column middle"></div>
                  <div className="al-center my-column middle grey-72">
                    活动详情
                  </div>
                  <div className="grey-border my-column middle"></div>
                </div>
                <div className="mo-activity-row__object mo-activity-row__object--content" dangerouslySetInnerHTML={this.createMarkup()}>
                </div>
              </div>
              <div className="mo-activity-row ">
                <div className=" mo-activity-row__object mo-activity-row__object--title row" onClick={!isManager ? this.push.bind(this, '/activity/' + activity.id + '/schedule?url=' + this.props.location.query.url) : this.push.bind(this, '/activity/' + activity.id + '/schedule?url=' + this.props.location.pathname)}>
                  <div className="col-md-8 col-xs-8 al-left">
                    查看详细行程
                  </div>
                  <div className="col-md-4 col-xs-4 al-right">
                    <span className="icon icon-yl-next grey-96"></span>
                  </div>
                </div>
              </div>
              <div className="mo-activity-row mo-activity-row--last">
                <div className="mo-activity-row__object row">
                  <div className="col-md-2 col-xs-1 col-padding-r-0 v-top">
                    <span className="icon icon-yl-address grey-72 fts-18"></span>
                  </div>
                  <div className="col-md-10 col-xs-11 col-padding-l-15 v-top">
                    <div>
                    <div className="grey-72">{activity.merchant ? activity.merchant.name : ''}</div>
                    <div className="grey-72 fts-12 mgt-10">{activity.address}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mo-activity-row mo-activity-row--indicator">
                <div className="mo-activity-row__object row">
                  <div className="col-md-2 col-xs-1 col-padding-r-0 v-center">
                    <span className="icon icon-yl-clock grey-72 fts-18"></span>
                  </div>
                  <div className="col-md-10 col-xs-11 col-padding-l-15 v-center">
                    <div className="grey-72">{`选择参加时间`}</div>
                  </div>
                </div>
              </div>
              <div className="mo-activity-row mo-activity-row--last">
                {entryOptionsHtml}
              </div>
              <div className="mo-activity-row mo-activity-row--indicator">
                <div className="mo-activity-row__object row">
                  <div className="col-md-2 col-xs-1 col-padding-r-0 v-center">
                    <span className="icon icon-yl-type grey-72 fts-18"></span>
                  </div>
                  <div className="col-md-10 col-xs-11 col-padding-l-15 v-center">
                    <div className="grey-72">{`选择票券类型`}</div>
                  </div>
                </div>
              </div>
              <div className="mo-activity-row mo-activity-row--last">
                {ticketOptionsHtml}
              </div>
              {buyHtml}
{/*              <div className="mo-bottom-modal dpl-flex dpl-flex--middle" id="share-modal">
                <div className="mo-bottom-modal__content">
                  <div className="al-center grey-72 mgt-15 mgb-15">分享至</div>
                  <div className="yl-border"></div>
                  <div className="share-images dpl-flex dpl-flex--space-between">
                    <div id="onMenuShareTimeline" onClick={this.onMenuShareTimeline.bind(this)}>
                      <img src={require('../../../../img/friend_circle.png')} srcSet={require('../../../../img/friend_circle@2x.png')}/>
                    </div>
                    <div id="onMenuShareTimeline" onClick={this.onMenuShareTimeline.bind(this)}>
                      <img src={require('../../../../img/wechat.png')} srcSet={require('../../../../img/wechat@2x.png')}/>
                    </div>
                  </div>
                  <div className="yl-border"></div>
                  <div className="al-center highlight mgt-15 mgb-15 close-modal">取消</div>
                </div>
              </div>*/}
            </div>
          );
        }
      }
    }
    return(
      <div className="page">
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  let {
    activity,
    datesHash,
    selectedDate,
    isNotFound,
    displayTicket,
    selectedTicketHash,
  } = state;
  return {
    activity,
    datesHash,
    selectedDate,
    isNotFound,
    displayTicket,
    selectedTicketHash,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchActivity: (id) => {
      dispatch(fetchActivity(id));
    },
    selecteDate: (selectedDate) => {
      dispatch(selecteDate(selectedDate));
    },
    setIsNotFound: (bool) => {
      dispatch(setIsNotFound(bool));
    },
    selectTicket: (id, entryList) => {
      dispatch(selectTicket(id, entryList));
    },
    removeTicket: (id) => {
      dispatch(removeTicket(id));
    },
    submitOrder: () => {
      dispatch(submitOrder());
    },
    setSelectedTicketHash: (hash) => {
      dispatch(setSelectedTicketHash(hash));
    }
  };
}

Activity.contextTypes = {
  router: React.PropTypes.object.isRequired
};

Activity.propTypes = {
  params: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
  isLoading: React.PropTypes.bool.isRequired,
  activity: React.PropTypes.object.isRequired,
  fetchActivity: React.PropTypes.func.isRequired,
  setIsNotFound: React.PropTypes.func.isRequired,
  selectTicket: React.PropTypes.func.isRequired,
  removeTicket: React.PropTypes.func.isRequired,
  submitOrder: React.PropTypes.func.isRequired,
  selecteDate: React.PropTypes.func.isRequired,
  isNotFound: React.PropTypes.bool.isRequired,
  datesHash: React.PropTypes.object.isRequired,
  selectedDate: React.PropTypes.string.isRequired,
  displayTicket: React.PropTypes.object.isRequired,
  selectedTicketHash: React.PropTypes.object.isRequired,
  isManager: React.PropTypes.bool.isRequired,
  setSelectedTicketHash: React.PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Activity);