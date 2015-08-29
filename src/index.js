require('babel/polyfill');
/**
 * Created by Ari on 8/29/15.
 */
const koa = require('koa');
const middleware = require('koa-load-middlewares')();
const app = koa();
const router = middleware.router();

app
  .use(middleware.parseJson())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT || 8080);
