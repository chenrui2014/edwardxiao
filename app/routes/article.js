import Router from 'koa-router';
import articles from '../controllers/articles';

const router = Router({
  prefix: '/articles'
});
router.get('/', articles.index);
router.get('/new', articles.index);

// for require auto in index.js
module.exports = router;
