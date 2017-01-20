var db = 'edwardxiao';
var database = {
  development: {
    url: 'mongodb://localhost/' + db
  },
  test: {
    url: 'mongodb://localhost/' + db
  },
  production: {
    url: 'mongodb://localhost/' + db
  }
};
module.exports = database;
