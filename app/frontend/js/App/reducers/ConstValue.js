import Login from '../components/Login';
import Signup from '../components/Signup';
import MyAccount from '../components/MyAccount';

export const DEFAULT_STATE = {
  locale: LOCALE,
  userInfo: USER_INFO,
  isFetching: false,
  modalContentName: 'Login',
  isSendVerifyCode: false,
  captcha: CAPTCHA_DATA,
};

export const MODAL_CONTENT_COMPONENT_OBJECT = {
  Login,
  Signup,
  MyAccount,
};