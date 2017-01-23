import { PATH } from '../../common/path';
import Utils from '../../common/utils';
import MyMessage from '../../common/my_message';
let message = new MyMessage();
import _ from 'lodash';
import { browserHistory } from 'react-router';
import update from 'react-addons-update';

import Validator from '../../common/my_validator';
let validator = new Validator();

export const SET_LOCALE = 'SET_LOCALE';
export const setLocale = (locale) => ({
  type: SET_LOCALE,
  locale
});

export const SET_USER_INFO = 'SET_USER_INFO';
export const setUserInfo = (userInfo) => ({
  type: SET_USER_INFO,
  userInfo
});

export const SET_ROLE = 'SET_ROLE';
export const setRole = (role) => ({
  type: SET_ROLE,
  role
});

export const SET_IS_LOGIN = 'SET_IS_LOGIN';
export const setIsLogin = (isLogin) => ({
  type: SET_IS_LOGIN,
  isLogin
});

export const SET_IS_SEND_VERIFY_CODE = 'SET_IS_SEND_VERIFY_CODE';
export const setIsSendVerifyCode = (isSendVerifyCode) => ({
  type: SET_IS_SEND_VERIFY_CODE,
  isSendVerifyCode
});

export const SET_IS_CAPTCHA = 'SET_IS_CAPTCHA';
export const setCaptcha = (captcha) => ({
  type: SET_IS_CAPTCHA,
  captcha
});

export const changeLocale = (locale) => (dispatch) => {
  changeLocaleApi(locale).then((res) => {
    console.log(res);
    if (res.code === 0) {
      dispatch(setLocale(res.data.locale));
    } else {
      if (res.msg) {
        alert(res.msg);
      }
    }
  }).catch((err) => {
    console.log(err);
  });
}

function changeLocaleApi(locale) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/api/settings/locale',
      data: { locale },
      type: 'post',
      success: (data) => {
        resolve(data);
      },
      error: (error) => {
        reject(error);
      }
    });
  })
}

export const changeCaptcha = () => (dispatch) => {
  changeCaptchaApi().then((res) => {
    console.log(res);
    if (res.code === 0) {
      dispatch(setCaptcha(res.data.captcha));
    } else {
      if (res.msg) {
        alert(res.msg);
      }
    }
  }).catch((err) => {
    console.log(err);
  });
}

function changeCaptchaApi() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/api/users/captcha',
      type: 'post',
      success: (data) => {
        resolve(data);
      },
      error: (error) => {
        reject(error);
      }
    });
  })
}

export const login = (username, password, captchaCode) => (dispatch) => {
  loginApi(username, password, captchaCode).then((res) => {
    console.log(res);
    if (res.code === 0) {
      dispatch(setUserInfo(res.data.currentUser));
      $('#accountModal').modal('toggle');
      dispatch(setCaptcha(''));
      window.CAPTCHA_DATA = '';
      if (res.msg){
        message.showMessage(res.msg);
      }
    } else {
      if (res.data.captcha) {
        console.log(res.data.captcha);
        dispatch(setCaptcha(res.data.captcha));
        if (res.msg) {
          if (!$('#captchaCode').parent().siblings('.my-validator-message').length) {
            validator.createMessage($('#captchaCode').parent(), res.msg, 'error');
          }
        }
      } else {
        if (res.msg) {
          if (!$('#password').parent().siblings('.my-validator-message').length) {
            validator.createMessage($('#password').parent(), res.msg, 'error');
          }
        }
      }
    }
  }).catch((err) => {
    console.log(err);
  });
}

function loginApi(username, password, captchaCode) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/api/users/login',
      data: { username, password, captchaCode },
      type: 'post',
      success: (data) => {
        resolve(data);
      },
      error: (error) => {
        reject(error);
      }
    });
  })
}

export const signup = (nickname, phone, email, verifyCode, password, avatar, captchaCode) => (dispatch) => {
  signupApi(nickname, phone, email, verifyCode, password, avatar, captchaCode).then((res) => {
    console.log(res);
    if (res.code === 0) {
      dispatch(setIsLogin(true));
      dispatch(setCaptcha(''));
      window.CAPTCHA_DATA = '';
      if (res.msg){
        message.showMessage(res.msg);
      }
    }
    else if (res.code === 1) {
      if (res.msg) {
        if (!$('#nickname').parent().siblings('.my-validator-message').length) {
          validator.createMessage($('#nickname').parent(), res.msg, 'error');
        }
      }
    }
    else if (res.code === 2) {
      if (res.msg) {
        if (!$('#phone').parent().siblings('.my-validator-message').length) {
          validator.createMessage($('#phone').parent(), res.msg, 'error');
        }
      }
    }
    else if (res.code === 3) {
      if (res.msg) {
        if (!$('#email').parent().siblings('.my-validator-message').length) {
          validator.createMessage($('#email').parent(), res.msg, 'error');
        }
      }
    }
    else if (res.code === 5){
      if (res.data.captcha) {
        console.log(res.data.captcha);
        dispatch(setCaptcha(res.data.captcha));
        if (res.msg) {
          if (!$('#captchaCode').parent().siblings('.my-validator-message').length) {
            validator.createMessage($('#captchaCode').parent(), res.msg, 'error');
          }
        }
      }
    }
  }).catch((err) => {
    console.log(err);
  });
}

function signupApi(nickname, phone, email, verifyCode, password, avatar, captchaCode) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/api/users/signup',
      data: { nickname, phone, email, verifyCode, password, avatar, captchaCode },
      type: 'post',
      success: (data) => {
        resolve(data);
      },
      error: (error) => {
        reject(error);
      }
    });
  })
}

export const logout = () => (dispatch) => {
  logoutApi().then((res) => {
    console.log(res);
    if (res.code === 0) {
      window.location = '/';
    } else {
      if (res.msg) {
        alert(res.msg);
      }
    }
  }).catch((err) => {
    console.log(err);
  });
}

function logoutApi() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/api/users/logout',
      type: 'post',
      success: (data) => {
        resolve(data);
      },
      error: (error) => {
        reject(error);
      }
    });
  })
}

export const fetchVerifyCode = (phone) => (dispatch) => {
  dispatch(setIsSendVerifyCode(true));
  fetchVerifyCodeApi(phone).then((res) => {
    console.log(res);
    if (res.code === 0) {
      // Utils.stopSpin('spin-loader');
    } else {
      if (res.msg) {
        alert(res.msg);
      }
    }
    // dispatch(setIsSendVerifyCode(false));
  }).catch((err) => {
    // debugger;
    // alert('网络错误，请重试');
    // dispatch(setIsSendVerifyCode(false));
    console.log(err);
  });
}

function fetchVerifyCodeApi(phone) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/api/register/sms',
      data: { phone },
      type: 'post',
      success: (data) => {
        resolve(data);
      },
      error: (error) => {
        reject(error);
      }
    });
  })
}
