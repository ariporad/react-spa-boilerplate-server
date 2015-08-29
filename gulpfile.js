/**
 * Created by Ari on 8/28/15.
 */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var server = require('gulp-develop-server');
var del = require('del');
var path = require('path');

var SRC = ['src/**/*.js'];
var DEST = './build';

var TESTS = 'src/**/*.test.js';

var START_SCRIPT = './main.js';

gulp.task('default', ['build']);

gulp.task('build', function() {
  return gulp.src(SRC)
    .pipe(plugins.changed(DEST))
    .pipe(plugins.babel())
    .pipe(gulp.dest(DEST));
});

gulp.task('lint', function() {
  return gulp.src(SRC)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('test', ['lint', 'mocha']);
gulp.task('mocha', function() {
  require('babel/register'); // Allow ES6 tests
  return gulp.src(TESTS)
    .pipe(plugins.mocha());
});

gulp.task('watch', ['build', 'server:start'], function() {
  gulp.watch(SRC, ['test', 'build', 'server:restart']);
});

gulp.task('run', ['server:start']);
gulp.task('server:start', ['test', 'build'], function() {
  var startScriptPath = START_SCRIPT.split('/').slice(0, -1).join('/');
  var appEntryPath = './' + path.relative(startScriptPath, path.join(DEST, 'index.js'));

  server.listen({
    path: START_SCRIPT,
    env: { NODE_ENV: 'development', APP_PATH: appEntryPath }
  });
});

gulp.task('server:restart', ['build'], function() {
  server.restart();
});

gulp.task('clean', function(cb) {
  del([DEST], cb);
});