/**
 * Created by Ari Porad on 8/29/15.
 */
require('babel/polyfill');
require('dotenv').load();
require('source-map-support').install();

var app = require(process.env.APP_PATH || './index.js');

var port = process.env.PORT || 8080;
app.start(port, function(){
  console.log('Server listening on port', port);
});
