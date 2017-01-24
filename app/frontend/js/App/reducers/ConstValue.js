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
  articleList: null,
  article: null,
  articleCurrentPage: 0,
  articleTotalPage: 0,
  isNotFound: false,
};

export const MODAL_CONTENT_COMPONENT_OBJECT = {
  Login,
  Signup,
  MyAccount,
};

export const ARTICLE_PER_PAGE = 15;