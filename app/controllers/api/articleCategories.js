import models from '../../models/index';
import _ from 'lodash';

const show = async(ctx, _next) => {

};

const getCategorieOptions = async(ctx, _next) => {
  let code = 0;
  let data = [];
  let articleCategoryList = [];

  let select = ['title'];
  let populate = 'articleCategory createdBy';
  let query = { isBanned: false, isPrivate: false };
  let sort = { updatedBy: -1 };
  let res = await getArticleCategories(query, select, sort, true, populate);

  data = res.data;

  ctx.body = { code, data };
};

const getArticleCategories = async(query = '', select, sort = '' , lean = true, populate = '', page = 0, perPage = 0) => {

  let data = [];
  let pages;
  let options = {
    select,
    sort,
    lean,
  };
  if (populate != ''){
    options['populate'] = populate;
  }
  if (page != 0) {
    options['page'] = page;
  }
  if (perPage != 0) {
    options['limit'] = perPage;
  }
  await models.ArticleCategory.paginate(query, options).then((result) => {
    console.log(result);
    if (result.docs.length) {
      data = result.docs;
      pages = result.pages;
    }
  });
  let result = {
    data,
    pages,
  }
  return result;
}


export default {
  show,
  getCategorieOptions,
};
