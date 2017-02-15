const port = Number.parseInt(process.env.PORT) || 3000;

module.exports = {
  port: port,
  appName: 'edwardxiao',
  hostName: 'http://localhost:' + port,
  serveStatic: true,
  assetHost: '',
  redisUrl: 'redis://192.168.10.10:6379/1',
  secretKeyBase: 'b90321d802cf09ef688b05eb6337efc3422b4e25fe42a311bc4e5ffb268c335590be89f464d3adabfbcfae4b431a5029ad6486bce777caa962d75a18322ea123',
  dbUrl: 'mongodb://edward:123321@127.0.0.1:27017/edwardxiao',
  qiniu: {
    'bucket': 'edward',
    'ACCESS_KEY': '_PxNiPlKDSnfrX_Y7xZ90r4oEzZRddZlxHjgcEIK',
    'SECRET_KEY': 'NmlxieqteCp9o4i1G862ZAz-z7PmI8wlFDsssM7M',
    'domain': 'oc54ddm6x.bkt.clouddn.com',
  },
};
