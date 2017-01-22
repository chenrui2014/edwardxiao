import models from '../../models/index';
import _ from 'lodash';
import svgCaptcha from 'svg-captcha';

const login = async(ctx, _next) => {
  let clientIp = ctx.request.ip;
  // ctx.cache.set('login:ip-' + clientIp, 0);
  // ctx.session.captcha = null;
  // ctx.session.captchaData = null;
  // return;
  let LANG_MESSAGE = require('../../locales/' + ctx.session.locale + '/message');
  let LANG_USER = require('../../locales/' + ctx.session.locale + '/user');

  let data = {};
  let msg = '';

  let {
    username,
    password,
    captchaCode,
  } = ctx.request.body;

  let isSeveralTimes = false;
  let isInvalidParams = false;
  let isInvalidPassword = false;

  let triedTimes = await ctx.cache.get('login:ip-' + clientIp);
  if (_.isNull(triedTimes)) {
    triedTimes = 0;
    ctx.cache.set('login:ip-' + clientIp, triedTimes);
  } else {
    if (triedTimes > 2) {
      isSeveralTimes == true;
      if (triedTimes === 3) {
        var captcha = svgCaptcha.create({ 'width': 100, 'height': 30, 'fontSize': 40 });
        ctx.session.captcha = captcha.text;
        ctx.session.captchaData = captcha.data;
      } else {
        if (!_.isUndefined(ctx.session.captcha) && !_.isNull(ctx.session.captcha)) {
          if (ctx.session.captcha !== captchaCode) {
            var captcha = svgCaptcha.create({ 'width': 100, 'height': 30, 'fontSize': 40 });
            ctx.session.captcha = captcha.text;
            ctx.session.captchaData = captcha.data;
            data['captcha'] = ctx.session.captchaData;
            console.log('gen: ' + ctx.session.captcha);
            console.log('user: ' + captchaCode);
            if (captchaCode === '') {
              msg = LANG_MESSAGE['please-enter-captcha'];
              ctx.body = { code: 1, data: data, msg: msg };
              return false;
            } else {
              if (ctx.session.captcha !== captchaCode) {
                msg = LANG_MESSAGE['invalid-captcha'];
                ctx.body = { code: 1, data: data, msg: msg };
                return false;
              }
            }
          }
        }
      }
    }
  }

  if (!isSeveralTimes) {
    var bcrypt = require('bcrypt');
    if (_.isUndefined(username) || username === '') {
      isInvalidParams = true;
      msg = LANG_MESSAGE.invalid + LANG_USER.username;
    }
    if (_.isUndefined(password) || password === '') {
      isInvalidParams = true;
      msg = LANG_MESSAGE.invalid + LANG_USER.password;
    }
  }

  if (!isSeveralTimes && !isInvalidParams) {
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
        data['currentUser'] = currentUser;
      } else {
        isInvalidPassword = true;
        msg = LANG_MESSAGE['invalid-password'];
      }
    } else {
      isInvalidPassword = true;
      msg = LANG_MESSAGE['invalid-password'];
    }
  }

  if (!isSeveralTimes && !isInvalidParams && !isInvalidPassword) {
    ctx.cache.set('login:ip-' + clientIp, 0);
    ctx.session.captcha = null;
    ctx.session.captchaData = null;
    ctx.body = { code: 0, data: data };
    return true;
  } else {
    ctx.cache.set('login:ip-' + clientIp, triedTimes + 1);
    ctx.body = { code: 1, data: data, msg: msg };
    var captcha = svgCaptcha.create({ 'width': 100, 'height': 30, 'fontSize': 40 });
    ctx.session.captcha = captcha.text;
    ctx.session.captchaData = captcha.data;
    return false;
  }
};

const signup = async(ctx, _next) => {
  let clientIp = ctx.request.ip;
  // ctx.cache.set('login:ip-' + clientIp, 0);
  // ctx.session.captcha = null;
  // ctx.session.captchaData = null;
  // return;
  let LANG_MESSAGE = require('../../locales/' + ctx.session.locale + '/message');
  let LANG_USER = require('../../locales/' + ctx.session.locale + '/user');

  let data = {};
  let msg = '';

  let {
    username,
    password,
    captchaCode,
  } = ctx.request.body;

  let isSeveralTimes = false;
  let isInvalidParams = false;

  let triedTimes = await ctx.cache.get('signup:ip-' + clientIp);
  if (_.isNull(triedTimes)) {
    triedTimes = 0;
    ctx.cache.set('signup:ip-' + clientIp, triedTimes);
  } else {
    if (triedTimes > 2) {
      isSeveralTimes == true;
      if (triedTimes === 3) {
        var captcha = svgCaptcha.create({ 'width': 100, 'height': 30, 'fontSize': 40 });
        ctx.session.captcha = captcha.text;
        ctx.session.captchaData = captcha.data;
      } else {
        if (!_.isUndefined(ctx.session.captcha) && !_.isNull(ctx.session.captcha)) {
          if (ctx.session.captcha !== captchaCode) {
            var captcha = svgCaptcha.create({ 'width': 100, 'height': 30, 'fontSize': 40 });
            ctx.session.captcha = captcha.text;
            ctx.session.captchaData = captcha.data;
            data['captcha'] = ctx.session.captchaData;
            console.log('gen: ' + ctx.session.captcha);
            console.log('user: ' + captchaCode);
            if (captchaCode === '') {
              msg = LANG_MESSAGE['please-enter-captcha'];
              ctx.body = { code: 1, data: data, msg: msg };
              return false;
            } else {
              if (ctx.session.captcha !== captchaCode) {
                msg = LANG_MESSAGE['invalid-captcha'];
                ctx.body = { code: 1, data: data, msg: msg };
                return false;
              }
            }
          }
        }
      }
    }
  }

  if (!isSeveralTimes) {
    var bcrypt = require('bcrypt');
    if (_.isUndefined(nickname) || nickname === '') {
      isInvalidParams = true;
      msg = LANG_MESSAGE.invalid + LANG_USER.nickname;
    }    if (_.isUndefined(phone) || phone === '') {
      isInvalidParams = true;
      msg = LANG_MESSAGE.invalid + LANG_USER.phone;
    }    if (_.isUndefined(email) || email === '') {
      isInvalidParams = true;
      msg = LANG_MESSAGE.invalid + LANG_USER.email;
    }    if (_.isUndefined(verifyCode) || verifyCode === '') {
      isInvalidParams = true;
      msg = LANG_MESSAGE.invalid + LANG_USER.verifyCode;
    }    if (_.isUndefined(password) || password === '') {
      isInvalidParams = true;
      msg = LANG_MESSAGE.invalid + LANG_USER.password;
    }    if (_.isUndefined(avatar) || avatar === '') {
      isInvalidParams = true;
      msg = LANG_MESSAGE.invalid + LANG_USER.avatar;
    }
  }

  if (!isSeveralTimes && !isInvalidParams) {
    ctx.cache.set('signup:ip-' + clientIp, 0);
    ctx.session.captcha = null;
    ctx.session.captchaData = null;
    ctx.body = { code: 0, data: data };
    return true;
  } else {
    ctx.cache.set('signup:ip-' + clientIp, triedTimes + 1);
    ctx.body = { code: 1, data: data, msg: msg };
    var captcha = svgCaptcha.create({ 'width': 100, 'height': 30, 'fontSize': 40 });
    ctx.session.captcha = captcha.text;
    ctx.session.captchaData = captcha.data;
    return false;
  }

};

const logout = async(ctx, _next) => {
  ctx.session.userId = null;
  ctx.body = { code: 0, data: {}, msg: '' };
};

const sendVerifyCode = async(ctx, _next) => {
  ctx.session.userId = null;
  ctx.body = { code: 0, data: {}, msg: '' };
};

const captcha = async(ctx, _next) => {
  let data = {};
  let msg = '';
  var svgCaptcha = require('svg-captcha');
  var captcha = svgCaptcha.create({ 'width': 100, 'height': 28, 'fontSize': 40 });
  ctx.session.captcha = captcha.text;
  ctx.session.captchaData = captcha.data;
  data['captcha'] = captcha.data;
  ctx.body = { code: 0, data: data, msg: msg };
  return true;
}

export default {
  login,
  signup,
  logout,
  sendVerifyCode,
  captcha,
};
