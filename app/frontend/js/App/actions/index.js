import { PATH } from '../../common/path';
import Utils from '../../common/utils';
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

export const changeLocale = (locale) => (dispatch) => {
   changeLocaleApi(locale).then((res) => {
      console.log(res);
      if (res.code === 0){
        dispatch(setLocale(res.data.locale));
      }
      else{
        if(res.msg){
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
      data: {locale},
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

export const login = (username, password) => (dispatch) => {
   loginApi(username, password).then((res) => {
      console.log(res);
      if (res.code === 0){
        dispatch(setUserInfo(res.data.currentUser));
        $('#accountModal').modal('toggle');
      }
      else{
        if(res.msg){
          if (!$('#password').parent().siblings('.my-validator-message').length){
            validator.createMessage($('#password').parent(), res.msg, 'error');
          }
        }
      }
    }).catch((err) => {
      console.log(err);
    });
  }

function loginApi(username, password) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/api/users/login',
      data: {username, password},
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
      if (res.code === 0){
        window.location = '/';
      }
      else{
        if(res.msg){
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