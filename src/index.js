/**
 * Created by Ari on 8/29/15.
 */
const koa = require('koa');
const middleware = require('koa-load-middlewares')();
const http = require('http');

function forceType(type) {
  return function *forceResponseType(next) {
    this.type = type;
    yield next;
  };
}

module.exports.start = function start(port, cb) {
  // These are setup down here for easy injection during testing
  const app = koa();
  const router = middleware.router();

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

  if (!port) return app;

  const server = http.createServer(app.callback());
  server.listen(port, cb);
  return { app, server };
};

module.exports.stop = function stop({ app, server }, cb) {
  server.stop(cb);
};

// TODO: How To Test?
