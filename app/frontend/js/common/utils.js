import _ from 'lodash';
import Spinner from 'spin.js';
// import moment from 'moment/min/moment.min';
import qrcode from 'arale-qrcode';
let utils = {
  urlParam: (name) => {
    let results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
  },
  setCookie: (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = 'expires='+ d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  },
  getCookie: (cname) => {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length,c.length);
      }
    }
    return '';
  },
  hideMobileMenu: () => {
    $('.mo-navbar__nav-mobile.mo-nav-mobile').removeClass('visible');
  },
  isWechat: () => {
    var ua = navigator.userAgent.toLowerCase();
    return (/micromessenger/.test(ua)) ? true : false ;
  },
  isMobileDevice: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  isWindowsWechat: () => {
    return /WindowsWechat/i.test(navigator.userAgent);
  },
  isAndroid: () => {
    return navigator.userAgent.toUpperCase().indexOf('ANDROID') > -1;
  },
  isIos: () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },
  isNumber: (val) => {
    if (_.isNaN(_.toNumber(val)) || !_.isNumber(_.toNumber(val))){
      return false;
    }
    return true;
  },
  scrollTo: (id) => {
    $('html, body').animate({
        scrollTop: $('#' + id).offset().top
    }, 500);
  },
  showModal: (id) => {
    $('.modal-mask.modal-mask--normal').addClass('visible');
    $('#' + id).addClass('visible');
  },
  hideModal: () => {
    $('.modal-mask.modal-mask--normal').click();
  },
  hideMask: () => {
    $('.modal-mask.modal-mask--normal').click();
  },
  showMask: () => {
    $('.modal-mask.modal-mask--normal').addClass('visible');
  },
  showUnclickableMask: () => {
    $('.modal-mask.modal-mask--unclickable').addClass('visible');
  },
  hideUnclickableMask: () => {
    $('.modal-mask.modal-mask--unclickable').removeClass('visible');
  },
  setupAjaxHeader: (_csrf) => {
    $.ajaxSetup({
      headers: {
        Accept: 'application/json',
      },
      data: {_csrf}
    });
  },
  createNonceStr: () => {
    return Math.random().toString(36).substr(2, 15);
  },
  createTimeStamp: () => {
    return parseInt(new Date().getTime() / 1000) + '';
  },
  showShareArrow: (src, srcSet) => {
    let $img = $('.share-helper__img');
    $img.attr('src', src);
    $img.attr('srcSet', srcSet);
    $('.share-helper').addClass('visible');
  },
  hideShareArrow: () => {
    $('.share-helper').removeClass('visible');
  },
  initSpin: (spinLoaderId, spinnerOpt={length: 20, radius: 20, scale: 0.3, direction: 1, speed: 1.0}) => {
    let $el = document.getElementById(spinLoaderId);
    if ($('#' + spinLoaderId).children().length == 0){
      let spinner = new Spinner(spinnerOpt).spin($el);
      $($el).data('spinner', spinner);
    }
  },
  stopSpin: (spinLoaderId) => {
    let $el = $('#' + spinLoaderId);
    if ($el.length){
      if ($el.data('spinner')){
        $el.data('spinner').stop();
      }
    }
  },
  scrollToFresh: (callback) => {
    $(window).on('scroll', _.throttle(() => {
      let $scrollTo = $('#scroll-to');
      if ($scrollTo.length){
        let hT = $scrollTo.offset().top,
            hH = $scrollTo.outerHeight(),
            wH = $(window).height(),
            wS = $(window).scrollTop();
        if (wS >= (hT+hH-wH - 30)){
          if (typeof callback == 'function'){
            callback();
          }
        }
      }
    }, 500));
  },
  generatQr: (url, elId) => {
    let qrnode = new qrcode({
      render: 'canvas',
      correctLevel: 3,
      text: url.toString(),
      size: 180,
      image : ''
    });
    $('#' + elId).html(qrnode);
  },
  getRandomNumber: (min, max) => {
    let res = Math.random() * (max - min) + min;
    return _.toNumber(res.toFixed(2));
  },
  formatSecurePhone: (phone) => {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  },
  formatSecureEmail: (email) => {
    let arr = email.split("@");
    let star = "";
    if (arr[0].length <= 3) {
      star = "*";
      arr[0] = arr[0].substr(0, arr[0].length - 1) + star;
    } else {
      star = "***";
      arr[0] = arr[0].substr(0, arr[0].length - 3) + star;
    }
    return email = arr[0] + "@" + arr[1];
  }
}

export default utils;