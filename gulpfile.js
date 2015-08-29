/**
 * Created by Ari on 8/28/15.
 */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var server = require('gulp-develop-server');
var del = require('del');

var SRC = ['src/**/*.js'];
var DEST = 'build';
var TESTS = 'src/**/*.test.js';

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
gulp.task('server:start', ['test', 'build'], function(){
  server.listen({ path: './' + DEST + '/index.js' });
});

gulp.task('server:restart', ['build'], function(){
  server.restart();
});

gulp.task('clean', function(cb){
  del([DEST], cb);
});