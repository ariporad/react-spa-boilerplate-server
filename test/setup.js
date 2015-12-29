/**
 * Created by Ari on 8/30/15.
 */

const sinon = require('sinon');
const chai = require('chai');
const supertest = require('supertest');
const rewire = require('rewire');

let startApp = () => console.log;

global.expect = chai.expect;

global.request = supertest;

global.useApp = function() {

};


/**
 * This was something that I was working on, that I decided to put aside. It would have
 * ~~used~~exploited mocha to allow you to set `this.useApp = true` in any describe or test, or even
 * in the root test case (outside of any describes). It seemed a little too complicated.
 */
// beforeEach(function(done){
//  const test = this.currentTest;
//  let useApp = false;
//  let toldNotToUseApp = false;
//  for(let parent = test; parent.parent && !toldNotToUseApp; parent = parent.parent) {
//    if (parent.userApp !== undefined) {
//      useApp = parent.useApp;
//      toldNotToUseApp = true;
//    }
//  }
//  if (!toldNotToUseApp) useApp = true;
//  if (useApp) {
//    beforeEach(function() {
//      const app = rewire('../src/index.js');
//    });
//    // TODO: Setup app, afterEach hook, docs.
//  }
// });
//
// global.setRunApp = function(handler){
//  startApp = handler;
// };