import Router from 'koa-router';
import articles from '../controllers/articles';

const router = Router({
  prefix: '/articles'
});
router.get('/', articles.index);
router.get('/new', articles.index);
router.get('/:id', articles.show);
router.get('/:id/edit', articles.index);

// for require auto in index.js
module.exports = router;
