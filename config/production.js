const port = Number.parseInt(process.env.PORT) || 5000;

module.exports = {
  port: port,
  hostName: process.env.HOST_NAME_PRO,
  serveStatic: process.env.SERVE_STATIC_PRO || false,
  assetHost: process.env.ASSET_HOST_PRO || '',
  redisUrl: process.env.REDIS_URL_PRO,
  secretKeyBase: process.env.SECRET_KEY_BASE,
  dbUrl: 'mongodb://edward:123321@127.0.0.1:27017/edwardxiao'
};
