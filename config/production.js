const port = Number.parseInt(process.env.PORT) || 5000;

module.exports = {
  port: port,
  hostName: process.env.HOST_NAME_PRO,
  serveStatic: process.env.SERVE_STATIC_PRO || false,
  assetHost: process.env.ASSET_HOST_PRO || '',
  redisUrl: process.env.REDIS_URL_PRO,
  secretKeyBase: process.env.SECRET_KEY_BASE,
  dbUrl: 'mongodb://edward:123321@127.0.0.1:27017/edwardxiao',
  qiniu: {
    'bucket': 'edward',
    'ACCESS_KEY': '_PxNiPlKDSnfrX_Y7xZ90r4oEzZRddZlxHjgcEIK',
    'SECRET_KEY': 'NmlxieqteCp9o4i1G862ZAz-z7PmI8wlFDsssM7M',
    'domain': 'http://oc54ddm6x.bkt.clouddn.com',
  },
};
