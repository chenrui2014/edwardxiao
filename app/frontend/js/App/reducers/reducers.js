import * as ACTION from '../actions';
import { DEFAULT_STATE } from './ConstValue';

export function locale(locale = DEFAULT_STATE.locale, action) {
  switch (action.type) {
    case ACTION.SET_LOCALE:
      return action.locale
    default:
      return locale;
  }
}

export function userInfo(userInfo = DEFAULT_STATE.userInfo, action) {
  switch (action.type) {
    case ACTION.SET_USER_INFO:
      return action.userInfo
    default:
      return userInfo;
  }
}

export function isFetching(isFetching = DEFAULT_STATE.isFetching, action) {
  switch (action.type) {
    case ACTION.SET_IS_FETCHING:
      return action.isFetching;
    default:
      return isFetching;
  }
}

export function modalContentName(modalContentName = DEFAULT_STATE.modalContentName, action) {
  switch (action.type) {
    case ACTION.SET_MODAL_CONTENT_NAME:
      return action.modalContentName;
    default:
      return modalContentName;
  }
}

export function isSendVerifyCode(isSendVerifyCode = DEFAULT_STATE.isSendVerifyCode, action) {
  switch (action.type) {
    case ACTION.SET_IS_SEND_VERIFY_CODE:
      return action.isSendVerifyCode;
    default:
      return isSendVerifyCode;
  }
}

export function captcha(captcha = DEFAULT_STATE.captcha, action) {
  switch (action.type) {
    case ACTION.SET_IS_CAPTCHA:
      return action.captcha;
    default:
      return captcha;
  }
}

export function articleList(articleList = DEFAULT_STATE.articleList, action) {
  switch (action.type) {
    case ACTION.SET_ARTICLE_LIST:
      return action.articleList;
    default:
      return articleList;
  }
}


export function article(article = DEFAULT_STATE.article, action) {
  switch (action.type) {
    case ACTION.SET_ARTICLE:
      return action.article;
    default:
      return article;
  }
}


export function articleListCurrentPage(articleListCurrentPage = DEFAULT_STATE.articleListCurrentPage, action) {
  switch (action.type) {
    case ACTION.SET_ARTICLE_LIST_CURRENT_PAGE:
      return action.articleListCurrentPage;
    default:
      return articleListCurrentPage;
  }
}


export function articleListTotalPage(articleListTotalPage = DEFAULT_STATE.articleListTotalPage, action) {
  switch (action.type) {
    case ACTION.SET_ARTICLE_LIST_TOTAL_PAGE:
      return action.articleListTotalPage;
    default:
      return articleListTotalPage;
  }
}


export function isNotFound(isNotFound = DEFAULT_STATE.isNotFound, action) {
  switch (action.type) {
    case ACTION.SET_IS_NOT_FOUND:
      return action.isNotFound;
    default:
      return isNotFound;
  }
}
