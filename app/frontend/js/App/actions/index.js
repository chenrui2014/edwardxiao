import { PATH } from '../../common/path';
import Utils from '../../common/utils';
import MyMessage from '../../common/my_message';
let message = new MyMessage();
import _ from 'lodash';
import { browserHistory } from 'react-router';
import update from 'react-addons-update';

import Validator from '../../common/my_validator';
let validator = new Validator();

import {
  ARTICLE_LIST_PER_PAGE,
  ARTICLE_CATEGORY_LIST_PER_PAGE,
} from '../reducers/ConstValue';

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

export const SET_MODAL_CONTENT_NAME = 'SET_MODAL_CONTENT_NAME';
export const setModalContentName = (modalContentName) => ({
  type: SET_MODAL_CONTENT_NAME,
  modalContentName
});

export const SET_SLIDE_MODAL_CONTENT_NAME= 'SET_SLIDE_MODAL_CONTENT_NAME';
export const setSlideModalContentName = (slideModalContentName) => ({
  type: SET_SLIDE_MODAL_CONTENT_NAME,
  slideModalContentName
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

export const SET_ARTICLE_LIST = 'SET_ARTICLE_LIST';
export const setArticleList = (articleList) => ({
  type: SET_ARTICLE_LIST,
  articleList
});

export const SET_ARTICLE_LIST_CURRENT_PAGE = 'SET_ARTICLE_LIST_CURRENT_PAGE';
export const setArticleListCurrentPage = (articleListCurrentPage) => ({
  type: SET_ARTICLE_LIST_CURRENT_PAGE,
  articleListCurrentPage
});

export const SET_ARTICLE_LIST_TOTAL_PAGE = 'SET_ARTICLE_LIST_TOTAL_PAGE';
export const setArticleListTotalPage = (articleListTotalPage) => ({
  type: SET_ARTICLE_LIST_TOTAL_PAGE,
  articleListTotalPage
});

export const SET_ARTICLE_CATEGORY_LIST = 'SET_ARTICLE_CATEGORY_LIST';
export const setArticleCategoryList = (articleCategoryList) => ({
  type: SET_ARTICLE_CATEGORY_LIST,
  articleCategoryList
});

export const SET_ARTICLE_CATEGORY = 'SET_ARTICLE_CATEGORY';
export const setArticleCategory = (articleCategory) => ({
  type: SET_ARTICLE_CATEGORY,
  articleCategory
});

export const SET_ARTICLE_CATEGORY_LIST_CURRENT_PAGE = 'SET_ARTICLE_CATEGORY_LIST_CURRENT_PAGE';
export const setArticleCategoryListCurrentPage = (articleCategoryListCurrentPage) => ({
  type: SET_ARTICLE_CATEGORY_LIST_CURRENT_PAGE,
  articleCategoryListCurrentPage
});

export const SET_ARTICLE_CATEGORY_LIST_TOTAL_PAGE = 'SET_ARTICLE_CATEGORY_LIST_TOTAL_PAGE';
export const setArticleCategoryListTotalPage = (articleCategoryListTotalPage) => ({
  type: SET_ARTICLE_CATEGORY_LIST_TOTAL_PAGE,
  articleCategoryListTotalPage
});

export const SET_IS_NOT_FOUND = 'SET_IS_NOT_FOUND';
export const setIsNotFound = (isNotFound) => ({
  type: SET_IS_NOT_FOUND,
  isNotFound
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

export const login = (username, password, captchaCode) => (dispatch, getState) => {
  loginApi(username, password, captchaCode).then((res) => {
    console.log(res);
    if (res.code === 0) {
      dispatch(setUserInfo(res.data.currentUser));
      $('#myModal').modal('toggle');
      dispatch(setCaptcha(''));
      window.CAPTCHA_DATA = '';
      if (getState().isNotFound){
        window.location.reload();
      }
      else{
        if (res.msg){
          message.showMessage(res.msg);
        }
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

export const signup = (id, nickname, phone, email, verifyCode, password, avatar, captchaCode) => (dispatch) => {
  signupApi(id, nickname, phone, email, verifyCode, password, avatar, captchaCode).then((res) => {
    console.log(res);
    if (res.code === 0) {
      if (res.data.currentUser){
        dispatch(setUserInfo(res.data.currentUser));
        dispatch(setCaptcha(''));
        window.CAPTCHA_DATA = '';
      }
      else{
        dispatch(setModalContentName('Login'));
        dispatch(setCaptcha(''));
        window.CAPTCHA_DATA = '';
      }
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

function signupApi(id, nickname, role, phone, email, verifyCode, password, avatar, captchaCode) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/api/users/signup',
      data: { id, nickname, role, phone, email, verifyCode, password, avatar, captchaCode },
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

export const remove = (id) => (dispatch) => {
  console.log(id);
  removeApi(id).then((res) => {
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

function removeApi(id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/api/users/delete',
      type: 'delete',
      data: { id },
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

export const fetchArticleList = (page, category, type) => (dispatch) => {
  Utils.initSpin('spin-loader');
  fetchArticleListApi(page, category, type).then((res) => {
    console.log(res);
    if (res.code === 0){
      console.log(res.data);
      dispatch(setArticleList(res.data));
      dispatch(setArticleListTotalPage(parseInt(res.pages)));
      dispatch(setArticleListCurrentPage(parseInt(res.page)));
      Utils.stopSpin('spin-loader');
    }
    else{
      if(res.msg){
        alert(res.msg);
      }
    }
  }).catch((err) => {
    // debugger;
    // alert('网络错误，请重试');
    console.log(err);
  });
}

function fetchArticleListApi(page, category, type) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/api/articles/',
      data: {page: page, perPage: ARTICLE_LIST_PER_PAGE, category: category, type: type},
      type: 'get',
      success: (data) => {
        resolve(data);
      },
      error: (error) => {
        reject(error);
      }
    });
  })
}

export const fetchArticleCategoryList = (nextPage) => (dispatch) => {
  Utils.initSpin('spin-loader');
  fetchArticleCategoryListApi(nextPage).then((res) => {
    console.log(res);
    if (res.code === 0){
      console.log(res.data);
      dispatch(setArticleCategoryList(res.data));
      dispatch(setArticleCategoryListTotalPage(parseInt(res.pages)));
      dispatch(setArticleCategoryListCurrentPage(parseInt(res.page)));
      Utils.stopSpin('spin-loader');
    }
    else{
      if(res.msg){
        alert(res.msg);
      }
    }
  }).catch((err) => {
    // debugger;
    // alert('网络错误，请重试');
    console.log(err);
  });
}

function fetchArticleCategoryListApi(nextPage) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: '/api/article_categories/',
      data: {page: nextPage, perPage: ARTICLE_CATEGORY_LIST_PER_PAGE},
      type: 'get',
      success: (data) => {
        resolve(data);
      },
      error: (error) => {
        reject(error);
      }
    });
  })
}
