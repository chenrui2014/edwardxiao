import Router from 'koa-router';
import articles from '../../controllers/api/articles';

const router = Router({
  prefix: '/api/articles'
});
router.get('/', articles.show);
router.get('/new', articles.checkLogin, articles.newArticle);
router.get('/:id', articles.show);
router.put('/:id', articles.checkLogin, articles.checkArticleOwner, articles.checkParamsBody, articles.update);
router.get('/:id/edit', articles.checkLogin, articles.checkArticleOwner, articles.edit);
router.post('/', articles.checkLogin, articles.checkParamsBody, articles.create);

// for require auto in index.js
module.exports = router;