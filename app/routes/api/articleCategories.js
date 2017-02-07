import Router from 'koa-router';
import articleCategories from '../../controllers/api/articleCategories';

const router = Router({
  prefix: '/api/articleCategories'
});
router.get('/options', articleCategories.getCategorieOptions);
// router.get('/new', articleCategories.checkLogin, articleCategories.newArticle);
// router.get('/:id', articleCategories.show);
// router.put('/:id', articleCategories.checkLogin, articleCategories.checkArticleOwner, articleCategories.checkParamsBody, articleCategories.update);
// router.get('/:id/edit', articleCategories.checkLogin, articleCategories.checkArticleOwner, articleCategories.edit);
// router.post('/', articleCategories.checkLogin, articleCategories.checkParamsBody, articleCategories.create);

// for require auto in index.js
module.exports = router;
