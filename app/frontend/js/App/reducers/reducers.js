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
