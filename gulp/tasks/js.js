var gulp = require('gulp'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    coffee = require("gulp-coffee"),
    util = require('gulp-util'),
    rimraf = require('gulp-rimraf'),
    ignore = require('gulp-ignore'),
    filter = require('gulp-filter'),
    path = require('path'),
    _ = require('lodash');

var handleErrors = require('../util/handleErrors');
var browserify = require('gulp-browserify');

var config = require('../config');

var environment = util.env.env || 'development';

var js = function() {
    return gulp.src([config.js.sourcePath + '**/*.js', config.js.tempPath + '**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(concat('global.js'))
        .pipe(environment === 'production' ? uglify() : util.noop())
        .pipe(sourcemaps.write({includeContent: true, sourceRoot: '/js'}))
        .pipe(gulp.dest(config.js.distPath));
    //return gulp.src(files.js + '**/*.js')
    //    .pipe(browserify({
    //        basedir: distPath,
    //        debug: true
    //    }))
    //    .pipe(concat('global.js'))
    //    .pipe(gulp.dest(distPath))
};

var removeCoffeeCompiles = function () {
    return gulp.src( config.js.tempPath + '**/*.*', { read: false })
        .pipe(rimraf({ force: true }));
};

gulp.task('js:coffee', function() {
    return gulp.src([config.js.sourcePath + '**/*.coffee']).pipe(coffee({
        sourceMap: true
    })).on('error', handleErrors).pipe(gulp.dest(config.js.tempPath));
});

gulp.task('js:concat', ['js:vendor', 'js:coffee'], function() {
    return js();
});

gulp.task('js', ['js:concat'], function() {
    return removeCoffeeCompiles();
});
