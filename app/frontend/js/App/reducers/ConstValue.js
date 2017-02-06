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
  articleListCurrentPage: 0,
  articleListTotalPage: 0,
  isNotFound: false,
};

export const MODAL_CONTENT_COMPONENT_OBJECT = {
  Login,
  Signup,
  MyAccount,
};

export const ARTICLE_LIST_PER_PAGE = 15;