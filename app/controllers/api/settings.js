import models from '../../models/index';

const locale = async (ctx, _next) => {
  let locale = ctx.request.body.locale;
  ctx.session.locale = locale;
  ctx.body = {code: 0, data: {locale: ctx.session.locale}};
};

export default {
  locale
};
