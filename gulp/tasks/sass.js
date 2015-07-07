var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var sass         = require('gulp-sass');
var minifycss    = require('gulp-minify-css');
var sourcemaps   = require('gulp-sourcemaps');
var handleErrors = require('../util/handleErrors');
var config       = require('../config').sass;
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', ['css:vendor'], function () {
  return gulp.src(config.src)
    .pipe(sourcemaps.init())
    .pipe(sass(config.settings))
    .on('error', handleErrors)
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({ browsers: ['last 2 version'] }))
    .pipe(gulp.dest(config.dest))
    .pipe(minifycss())
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});
