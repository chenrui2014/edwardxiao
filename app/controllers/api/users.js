import models from '../../models/index';
import _ from 'lodash';

const login = async (ctx, _next) => {
  let LANG = require('../../locales/' + ctx.session.locale);
  let {
    username,
    password,
  } = ctx.request.body;
  let msg = '';
  if (_.isUndefined(username) || username === ''){
    msg = LANG.messages.invalid + LANG.users.username;
    ctx.body = {code: 1, data: {}, msg: msg};
    return false;
  }
  if (_.isUndefined(password) || password === ''){
    msg = LANG.messages.invalid + LANG.users.password;
    ctx.body = {code: 1, data: {}, msg: msg};
    return false;
  }
  let currentUser;
  await models.User.findByName(username).exec((err, res) => {
    if (!_.isNull(err)){
      msg = LANG.messages.network + LANG.messages.error;
      return false;
    }
    if (res.length){
      let user = res[0];
      if (user.password == password){
        currentUser = {
          '_id': user._id,
          'name': user.name,
          'role': user.role,
          'phone': user.phone,
          'email': user.email,
          'createdAt': user.createdAt,
        }
        ctx.session.userId = user._id;
        ctx.body = {code: 0, data: {currentUser}};
        return true;
      }
      else{
        msg = LANG.messages['invalid-password'];
        ctx.body = {code: 1, data: {}, msg: msg};
        return false;
      }
    }
    else{
      msg = LANG.messages['invalid-password'];
      ctx.body = {code: 1, data: {}, msg: msg};
      return false;
    }
  });
};

const logout = async (ctx, _next) => {
  let msg = '';
  ctx.session.userId = null;
  ctx.body = {code: 0, data: {}, msg: msg};
  return true;
};

export default {
  login,
  logout
};
