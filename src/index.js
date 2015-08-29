/**
 * Created by Ari on 8/29/15.
 */
const koa = require('koa');
const middleware = require('koa-load-middlewares')();
const app = koa();
const router = middleware.router();

module.exports.start = function(port) {
  app
    .use(middleware.favi())
    .use(middleware.parseJson())
    .use(router.routes())
    .use(router.allowedMethods());

  router.get('/', function* getRoot() {
    this.body = yield Promise.resolve('hello world!');
  });

  app.listen(port);
  console.log('Server listening on port %s', port);
};
