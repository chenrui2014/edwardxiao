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
    let user;
    let nicknameRes = await models.User.findByNickName(username);
    let phoneRes = await models.User.findByPhone(username);
    let emailRes = await models.User.findByEmail(username);
    if (nicknameRes.length){
      user = nicknameRes[0];
    }
    else if (phoneRes.length){
      user = phoneRes[0];
    }
    else if (emailRes.length){
      user = emailRes[0];
    }
    if (!_.isUndefined(user)) {
      let isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        currentUser = {
          '_id': user._id,
          'nickname': user.nickname,
          'role': user.role,
          'phone': user.phone,
          'email': user.email,
          'avatar': user.avatar,
          'createdAt': user.createdAt,
        }
        ctx.session.userId = user._id;
        console.log(1111);
        console.log(ctx.session.userId);
        console.log(1111);
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
    msg = LANG_MESSAGE['welcome-back'] + ', ' + data['currentUser'].nickname;
    ctx.body = { code: 0, data: data, msg: msg };
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
    nickname,
    username,
    password,
    phone,
    email,
    avatar,
    verifyCode,
    captchaCode,
  } = ctx.request.body;

  let isSeveralTimes = false;
  let isInvalidParams = false;
  let isDuplicateUser = false;

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
              ctx.body = { code: 5, data: data, msg: msg };//5: captcha
              return false;
            } else {
              if (ctx.session.captcha !== captchaCode) {
                msg = LANG_MESSAGE['invalid-captcha'];
                ctx.body = { code: 5, data: data, msg: msg };//5: captcha
                return false;
              }
            }
          }
        }
      }
    }
  }

  if (!isSeveralTimes) {
    if (_.isUndefined(nickname) || nickname === '') {
      isInvalidParams = true;
      msg = LANG_MESSAGE.invalid + LANG_USER.nickname;
    }
    if ((_.isUndefined(phone) || phone === '') && (_.isUndefined(email) || email === '')) {
      isInvalidParams = true;
      msg = LANG_MESSAGE.invalid + LANG_USER['phone-or-email'];
    }

    // TODO: when I have money
    // if (_.isUndefined(verifyCode) || verifyCode === '') {
    //   isInvalidParams = true;
    //   msg = LANG_MESSAGE.invalid + LANG_USER['verify-code'];
    // }

    if (_.isUndefined(password) || password === '') {
      isInvalidParams = true;
      msg = LANG_MESSAGE.invalid + LANG_USER.password;
    }
  }

  // isInvalidParams = true;
  // msg = LANG_MESSAGE.invalid + LANG_USER.password;
  // ctx.body = { code: 1, data: data, msg: msg };
  // return;

  let code = 0;

  if (!isSeveralTimes && !isInvalidParams) {
    let res;
    res = await models.User.findByNickName(nickname);
    if (res.length) {
      isDuplicateUser = true;
      code = 1;
      msg = LANG_USER.nickname + LANG_MESSAGE['already-exist'];
    } else {
      if (phone != ''){
        res = await models.User.findByPhone(phone);
        if (res.length) {
          isDuplicateUser = true;
          code = 2;
          msg = LANG_USER.phone + LANG_MESSAGE['already-exist'];
        }
      }
      if (email != ''){
        res = await models.User.findByEmail(email);
        if (res.length) {
          isDuplicateUser = true;
          code = 3;
          msg = LANG_USER.email + LANG_MESSAGE['already-exist'];
        }
      }
    }
    // ctx.body = { code: code, data: data, msg: msg };
    // return;
    // else if
    // res = await models.User.findByPhone(phone);
    // if (res.length){
    //   isDuplicateUser = true;
    // }
  }

  if (!isSeveralTimes && !isInvalidParams && !isDuplicateUser) {

    var bcrypt = require('bcrypt');
    const saltRounds = 10;

    var hash = bcrypt.hashSync(password, saltRounds);
    var usersList = [{
      nickname: nickname,
      role: 'user',
      phone: phone,
      email: email,
      avatar: avatar,
      password: hash,
    }];

    let result;
    await models.User.insertMany(usersList, (err, docs) => {
      if(!_.isNull(err)){
        result = false;
        code = 4;// faild
      }
      else{
        result = true;
        code = 0;
      }
    });
    ctx.cache.set('signup:ip-' + clientIp, 0);
    ctx.session.captcha = null;
    ctx.session.captchaData = null;
    msg = LANG_USER['signup'] + LANG_MESSAGE['successfully'] + ', ' + LANG_MESSAGE['please'] + LANG_USER['login'];
    ctx.body = { code: code, data: data, msg: msg };
    return true;
  } else {
    ctx.cache.set('signup:ip-' + clientIp, triedTimes + 1);
    ctx.body = { code: code, data: data, msg: msg };
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
  console.log(captcha.text);
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
