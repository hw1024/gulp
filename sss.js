const gulp = require('gulp'),
  runSequence = require('run-sequence'),
  gulpif = require('gulp-if'),
  uglify = require('gulp-uglify'),
  csslint = require('gulp-csslint'),
  rev = require('gulp-rev'),
  minifyCss = require('gulp-minify-css'),
  changed = require('gulp-changed'),
  concat = require('gulp-concat'),
  jshint = require('gulp-jshint'),
  clean = require('gulp-clean'),
  stylish = require('jshint-stylish'),
  revCollector = require('gulp-rev-collector'),
  minifyHtml = require('gulp-minify-html'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require("gulp-sass-china"),
  watch = require('gulp-watch'),
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

  return gulp.src(src)
    .pipe(gulpif(
      condition, uglify({
        mangle: {except:['require','exports','module']},
        compress:false
      })
    ))
    .pipe(rev())
    .pipe(gulp.dest(dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest(revs))
}

function miniCss (src,dest,revs) {
  return gulp.src([src])
    .pipe(revCollector())
    .pipe(gulpif(
      condition, minifyCss({
        compatibility: 'ie7'
      })
    ))
    .pipe(rev())
    .pipe(gulp.dest(dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest(revs))
}

gulp.task('sass', function (){
    gulp.src('dev/sass/**/*.scss')
        .pipe(watch('dev/sass/**/*.scss'))
        .pipe(sass({
            outputStyle: 'compact'
        })
            .on('error', sass.logError))
        .pipe(dgbl())
        .pipe(gulp.dest('dev/css'))
});
//检测JS
gulp.task('lintJs', function(){
  return gulp.src(jsSrc)
    .pipe(jscs())   //检测JS风格
    .pipe(jshint({
      "undef": false,
      "unused": false
    }))
    .pipe(jshint.reporter('default'))  //错误默认提示
    .pipe(jshint.reporter(stylish))   //高亮提示
    .pipe(jshint.reporter('fail'))
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
  return gulp.src(['src/rev/**/*.json', 'application/view/**/*.html'])
    .pipe(watch('application/view/**/*.html'))
    .pipe(revCollector())
    .pipe(gulpif(
      condition, minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      })
    ))
    .pipe(gulp.dest('application/views'))
});

/**
 * 清理文件
 */
gulp.task('clean', function () {
  return del(['Sites/*','src/*'])
});

gulp.task('watch', function() {
    gulp.watch('dev/sass/**/*.scss',['sass'])
    gulp.watch(static.js,['miniJs'])
    gulp.watch(static.css,['miniCss'])
    gulp.watch('application/view/**/*.html',['miniHtml'])
});



//开发构建
gulp.task('dev', function (done) {
  condition = false
  runSequence(
    ['sass'],
    ['miniCss', 'miniJs'],
    ['miniHtml'],
  done)
});
//正式构建
gulp.task('build', function (done) {
  runSequence(
     ['miniCss', 'miniJs'],
     ['miniHtml'],
  done)
});
gulp.task('mini', ['build']);