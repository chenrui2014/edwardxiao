import Router from 'koa-router';
import users from '../../controllers/api/users';

const router = Router({
  prefix: '/api/users'
});
router.post('/login', users.login);
router.post('/logout', users.logout);

// for require auto in index.js
module.exports = router;
