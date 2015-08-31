/**
 * Created by Ari Porad on 8/29/15.
 */

require('app-module-path').addPath(process.env.APP_DIR);
require('babel/polyfill');
require('dotenv').load();
require('source-map-support').install();

var app = require(process.env.APP_PATH || process.env.APP_DIR);

var port = process.env.PORT || 8080;
app.start(port, function(){
  console.log('Server listening on port', port);
});
