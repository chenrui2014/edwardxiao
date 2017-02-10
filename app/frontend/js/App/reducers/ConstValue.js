import Login from '../components/Login';
import Signup from '../components/Signup';
import MyAccount from '../components/MyAccount';
import GraphicDesign from '../Pages/GraphicDesign';
import LogoDesign from '../Pages/LogoDesign';
import IndustrialDesign from '../Pages/IndustrialDesign';
import WebDesign from '../Pages/WebDesign';
import Photograph from '../Pages/Photograph';
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
  articleListCurrentPage: 1,
  articleListTotalPage: 0,
  articleCategoryList: null,
  articleCategory: 'all',
  articleCategoryListCurrentPage: 1,
  articleCategoryListTotalPage: 0,
  isNotFound: false,
};

export const MODAL_CONTENT_COMPONENT_OBJECT = {
  Login,
  Signup,
  MyAccount,
  Empty,
};

export const SLIDE_MODAL_CONTENT_COMPONENT_OBJECT = {
  GraphicDesign,
  LogoDesign,
  IndustrialDesign,
  WebDesign,
  Photograph,
  Empty,
};

export const ARTICLE_LIST_PER_PAGE = 15;
export const ARTICLE_CATEGORY_LIST_PER_PAGE = 15;