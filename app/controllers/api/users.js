import models from '../../models/index';
import _ from 'lodash';

const login = async(ctx, _next) => {

  var bcrypt = require('bcrypt');

  let LANG_MESSAGE = require('../../locales/' + ctx.session.locale + '/message');
  let LANG_USER = require('../../locales/' + ctx.session.locale + '/user');
  let {
    username,
    password,
  } = ctx.request.body;
  let msg = '';
  if (_.isUndefined(username) || username === '') {
    msg = LANG_MESSAGE.invalid + LANG_USER.username;
    ctx.body = { code: 1, data: {}, msg: msg };
  }
  if (_.isUndefined(password) || password === '') {
    msg = LANG_MESSAGE.invalid + LANG_USER.password;
    ctx.body = { code: 1, data: {}, msg: msg };
  }
  let currentUser;
  let res = await models.User.findByName(username);
  if (res.length) {
    let user = res[0];
    let isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      currentUser = {
        '_id': user._id,
        'name': user.name,
        'role': user.role,
        'phone': user.phone,
        'email': user.email,
        'createdAt': user.createdAt,
      }
      ctx.session.userId = user._id;
      ctx.body = { code: 0, data: { currentUser } };
    } else {
      msg = LANG_MESSAGE['invalid-password'];
      ctx.body = { code: 1, data: {}, msg: msg };
    }
  } else {
    msg = LANG_MESSAGE['invalid-password'];
    ctx.body = { code: 1, data: {}, msg: msg };
  }
};

const logout = async(ctx, _next) => {
  let msg = '';
  ctx.session.userId = null;
  ctx.body = { code: 0, data: {}, msg: msg };
};

export default {
  login,
  logout
};
