import Router from 'koa-router';
import articles from '../controllers/articles';

const router = Router({
  prefix: '/'
});
router.get('articles', articles.index);

// for require auto in index.js
module.exports = router;
