// Modified from https://github.com/koajs/api-boilerplate/blob/master/lib/load/index.js

/**
 * Module dependencies.
 */

const makeResource = require('koa-resource-router');
const debug = require('debug')('load');
const path = require('path');
const fs = require('fs');

/**
 * Load resources in `root` directory.
 *
 * TODO: bootstrapping into an npm module.
 *
 * TODO: adding .resources to config is lame, but assuming no routes is also lame, change me
 *
 * @param {Application} app
 * @param {String} root
 * @api private
 */

module.exports = function load(app, router, root) {
  fs.readdirSync(root).forEach((raw) => {
    const file = path.resolve(root, raw);
    const stats = fs.lstatSync(file);

    if (raw.toLowerCase().indexOf('test') > -1) return;
    if (raw.toLowerCase().indexOf('js') === -1) return;
    if (stats.isDirectory()) {
      load(app, path.join(root, raw));
      return;
    }

    let mod;
    try {
      mod = require(file);
    } catch (e) {
      return;
    }
    if (typeof mod === 'function') mod = mod();

    const conf = mod.config || mod.conf;

    if (!conf) {
      debug(`file ${raw} doesn\'t export .config`);
      return;
    }

    conf.name = raw;
    conf.file = file;
    if (conf.routes) {
      route(app, router, mod, conf);
    } else {
      resource(app, router, mod, conf);
    }
  });
};

/**
 * Define routes in `conf`.
 */

module.exports._route = function route(app, router, mod, conf) {
  debug('routes: %s', conf.name);

  for (const key in conf.routes) {
    if (!conf.routes.hasOwnProperty(key)) continue;
    const prop = conf.routes[key];
    const method = key.split(' ')[0];
    const url = key.split(' ')[1];
    debug('%s %s -> .%s', method, url, prop);

    let fn = mod[prop];
    if (!fn) throw new Error(conf.name + ': exports.' + prop + ' is not defined');

    if (!(fn instanceof Array)) fn = [fn];
    fn = fn.filter(f => typeof f === 'function');

    router[method.toLowerCase()](url, ...fn);
  }
};

/**
 * Define resource in `conf`.
 */

module.exports._resource = function resource(app, router, mod, conf) {
  if (!conf.name) throw new Error(`.name in ${conf.file} is required`);
  debug('resource: %s', conf.name);

  let resourceRouter;
  if (mod.middleware) {
    resourceRouter = makeResource(conf.name, ...mod.middleware, mod);
  } else {
    resourceRouter = makeResource(conf.name, mod);
  }

  app.use(resourceRouter.middleware());
};
