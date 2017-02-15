import Login from '../components/Login';
import Signup from '../components/Signup';
import MyAccount from '../components/MyAccount';
import Portfolio from '../components/Portfolio';
import Empty from '../components/Empty';

export const DEFAULT_STATE = {
  locale: LOCALE,
  userInfo: USER_INFO,
  isFetching: false,
  modalContentName: 'Empty',
  slideModalContentName: 'Empty',
  isSendVerifyCode: false,
  captcha: CAPTCHA_DATA,
  articleList: null,
  articleListCurrentPage: 0,
  articleListTotalPage: 0,
  articleCategoryList: null,
  articleCategory: 'all',
  articleCategoryListCurrentPage: 0,
  articleCategoryListTotalPage: 0,
  isNotFound: false,
  portfolioType: 'graphic_design',
};

export const MODAL_CONTENT_COMPONENT_OBJECT = {
  Login,
  Signup,
  MyAccount,
  Empty,
};

export const SLIDE_MODAL_CONTENT_COMPONENT_OBJECT = {
  Portfolio,
  Empty,
};

export const ARTICLE_LIST_PER_PAGE = 15;
export const ARTICLE_CATEGORY_LIST_PER_PAGE = 15;