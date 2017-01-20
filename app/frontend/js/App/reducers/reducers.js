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

export function isLogin(isLogin = DEFAULT_STATE.isLogin, action) {
  switch (action.type) {
    case ACTION.SET_IS_LOGIN:
      return action.isLogin;
    default:
      return isLogin;
  }
}
