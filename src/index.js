/**
 * Created by Ari on 8/29/15.
 */
const koa = require('koa');
const middleware = require('koa-load-middlewares')();
const app = koa();
const router = middleware.router();

function forceType(type) {
  return function *forceResponseType(next) {
    this.type = type;
    yield next;
  };
}

module.exports.start = function(port) {

  app
    .use(middleware.error());

  // This has to go before error handling
  if (process.env.NODE_ENV === 'development') {
    app.use(middleware.notifier());
  }

  app
    .use(forceType('json'))
    .use(middleware.compress())
    .use(middleware.favi())
    .use(middleware.parseJson())
    .use(middleware.jsonp())
    .use(router.routes())
    .use(router.allowedMethods());

  router.get('/', function* getRoot() {
    this.body = yield Promise.resolve('hello world!');
  });

  app.listen(port);
  console.log('Server listening on port %s', port);
};
