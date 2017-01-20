import Router from 'koa-router';
import settings from '../../controllers/api/settings';

const router = Router({
  prefix: '/api/settings'
});
router.post('/locale', settings.locale);

// for require auto in index.js
module.exports = router;
