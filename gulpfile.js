const gulp = require('gulp'),
  runSequence = require('run-sequence'),
  gulpif = require('gulp-if'),
  uglify = require('gulp-uglify'),
  rev = require('gulp-rev'),
  minifyCss = require('gulp-minify-css'),
  revCollector = require('gulp-rev-collector'),
  minifyHtml = require('gulp-minify-html'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require("gulp-sass-china"),
  watch = require('gulp-watch'),
  imageisux = require('gulp-imageisux'),
  livereload = require('gulp-livereload'),
  browsersync = require('browser-sync').create(),
  dgbl = require("del-gulpsass-blank-lines"),
  del = require('del');
var static = {
  js:'dev/js/**/*.js',
  css:'dev/css/*.css'
};
var dest = {
  js:'Sites/js',
  css:'Sites/css'
};
var revs = {
  js:'src/rev/js',
  css:'src/rev/css'

};
var condition = true;

function miniJs (src,dest,revs) {
  return gulp.src([src])
    .pipe(gulpif(
      condition, uglify({
        mangle: false,
        compress:true
      })
    ))
    .pipe(rev())

    .pipe(gulp.dest(dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest(revs))
    .pipe(browsersync.stream());
}

function miniCss (src,dest,revs) {
  return gulp.src([src])
    .pipe(revCollector())
    .pipe(gulpif(
      condition, minifyCss({
        compatibility: 'ie7'
      })
    ))
    .pipe(dgbl())
    .pipe(rev())
    .pipe(gulp.dest(dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest(revs))
    .pipe(browsersync.stream());
}

gulp.task('sass', function (){
    gulp.src('dev/sass/**/*.scss')
        .pipe(sass({
            outputStyle: 'compact'
        })
            .on('error', sass.logError))
        .pipe(dgbl())
        .pipe(gulp.dest('dev/css'))
        .pipe(browsersync.stream());
});
//压缩JS/生成版本号
gulp.task('miniJs', function(){
  return miniJs(static.js,dest.js,revs.js)
});
//压缩/合并CSS
gulp.task('miniCss', function(){
  return miniCss(static.css,dest.css,revs.css)
});
//压缩Html/更新引入文件版本
gulp.task('miniHtml', function () {
  return gulp.src(['application/view/**/*.html'])
    .pipe(revCollector())
    .pipe(gulpif(
      condition, minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      })
    ))
    .pipe(gulp.dest('application/views'))
    .pipe(browsersync.stream());
});

gulp.task('imageisux', function() {
  return gulp.src(['dev/image/**/*'])
  .pipe(gulp.dest('Sites/image'))
  .pipe(browsersync.stream());
    
});
 
//开发构建
gulp.task('dev', function (done) {
  condition = false
  runSequence(
    ['sass'],
    ['miniCss'],
    ['miniJs'],
    ['miniHtml'],
    ['imageisux'],
  done)
});
//正式构建
gulp.task('build', function (done) {
  runSequence(
     ['miniCss'], 
     ['miniJs'],
     ['miniHtml'],
     ['imageisux'],
  done)
  browsersync.init({
      port: 2016,
      server: {
        baseDir: ['gulptest/application/']
      }
  });
  gulp.watch('dev/js/**/*.js', ['miniJs']);         //监控文件变化，自动更新
  gulp.watch('dev/sass/**/*.scss', ['sass']);         //监控文件变化，自动更新
  gulp.watch('dev/css/*.css', ['miniCss']);
  gulp.watch('  /image/**/*', ['imageisux']);
  gulp.watch('application/view/**/*.html', ['miniHtml']);
});
gulp.task('mini', ['build']);