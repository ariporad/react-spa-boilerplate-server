/**
 * Created by Ari on 8/29/15.
 */
const koa = require('koa');
const middleware = require('koa-load-middlewares')();
const app = koa();
const router = middleware.router();

const errorMiddleware = require('./middleware/errors');
const errorCodes = require('./errorCodes');

module.exports.start = function(port) {
  // This must go first
  if (process.env.NODE_ENV === 'development') {
    app.use(middleware.notifier());
  }

  app
    .use(middleware.error({ template: __dirname + '/error.json' }))
    .use(errorMiddleware.validateErrorCode())
    .use(errorMiddleware.statusCodesToErrCodes(errorCodes));

  if (process.env.NODE_ENV === 'development') {
    app.use(middleware.notifier());
  }

  app
    .use(middleware.compress())
    .use(middleware.favi())
    .use(middleware.parseJson())
    .use(middleware.jsonp())
    .use(router.routes())
    .use(router.allowedMethods());

  router.get('/', function* getRoot() {
    this.body = yield Promise.resolve('hello world!');
  });

  router.get('/error', function *getError() {
    const err = new Error('EVERYTHING IS SO BROKEN!');
    this.response.status = 418;
    if (Math.round(Math.random())) err.code = 'E12345678';
    throw err;
  });

  app.listen(port);
  console.log('Server listening on port %s', port);
};
