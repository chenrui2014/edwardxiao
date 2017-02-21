import Login from '../components/Login';
import Signup from '../components/Signup';
import MyAccount from '../components/MyAccount';
import Portfolio from '../components/Portfolio';
import Empty from '../components/Empty';

export const DEFAULT_STATE = {
  locale: typeof __PRELOADED_STATE__ !== 'undefined' && typeof __PRELOADED_STATE__.locale !== 'undefined' ? __PRELOADED_STATE__.locale : 'zh-CN',
  currentUser: typeof __PRELOADED_STATE__ !== 'undefined' && typeof __PRELOADED_STATE__.currentUser !== 'undefined' ? __PRELOADED_STATE__.currentUser : {},
  isFetching: false,
  modalContentName: 'Empty',
  slideModalContentName: 'Empty',
  isSendVerifyCode: false,
  captcha: typeof __PRELOADED_STATE__ !== 'undefined' && typeof __PRELOADED_STATE__.captchaData !== 'undefined' ? __PRELOADED_STATE__.captchaData : '',
  article: typeof __PRELOADED_STATE__ !== 'undefined' && typeof __PRELOADED_STATE__.article !== 'undefined' ? __PRELOADED_STATE__.article : null,
  articleCategoryOptions: typeof __PRELOADED_STATE__ !== 'undefined' && typeof __PRELOADED_STATE__.articleCategoryOptions !== 'undefined' ? __PRELOADED_STATE__.articleCategoryOptions : null,
  articleList: typeof __PRELOADED_STATE__ !== 'undefined' && typeof __PRELOADED_STATE__.articleList !== 'undefined' ? __PRELOADED_STATE__.articleList : null,
  articleListCurrentPage: typeof __PRELOADED_STATE__ !== 'undefined' && typeof __PRELOADED_STATE__.articleListCurrentPage !== 'undefined' ? __PRELOADED_STATE__.articleListCurrentPage : 0,
  articleListTotalPage: typeof __PRELOADED_STATE__ !== 'undefined' && typeof __PRELOADED_STATE__.articleListTotalPage !== 'undefined' ? __PRELOADED_STATE__.articleListTotalPage : 0,
  articleCategoryList: typeof __PRELOADED_STATE__ !== 'undefined' && typeof __PRELOADED_STATE__.articleList !== 'undefined' ? __PRELOADED_STATE__.articleList : null,
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
