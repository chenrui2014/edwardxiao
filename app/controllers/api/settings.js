import models from '../../models/index';
import config from '../../../config/config';

const locale = async(ctx, _next) => {
  let locale = ctx.request.body.locale;
  ctx.session.locale = locale;
  ctx.body = { code: 0, data: { locale: ctx.session.locale } };
};

const uptoken = async(ctx, _next) => {
  let qiniu = require("qiniu");
  qiniu.conf.ACCESS_KEY = config.qiniu.ACCESS_KEY;
  qiniu.conf.SECRET_KEY = config.qiniu.SECRET_KEY;

  let bucket = config.qiniu.bucket;

  function uptoken(bucket) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket);
    return putPolicy.token();
  }

  let token = uptoken(bucket);
  ctx.body = { 'uptoken': token };
};


export default {
  locale,
  uptoken,
};
