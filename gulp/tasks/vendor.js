var gulp = require('gulp'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    csso = require('gulp-csso'),
    coffee = require("gulp-coffee"),
    util = require('gulp-util'),
    rimraf = require('gulp-rimraf'),
    ignore = require('gulp-ignore'),
    filter = require('gulp-filter'),
    path = require('path'),
    bowerFiles = require('main-bower-files'),
    foreach = require('gulp-foreach'),
    rename = require("gulp-rename"),
    _ = require('lodash'),
    reduce = require('gulp-reduce-file');

var config = require('../config');

var environment = util.env.env || 'development',

    missing = [
        config.vendor.vendorRoot + 'jquery-throttle-debounce/jquery.ba-throttle-debounce.js',
        config.vendor.vendorRoot + 'rangeslider/dist/rangeslider.css',
        config.vendor.vendorRoot + 'rome/dist/rome.css',
        config.vendor.vendorRoot + 'materialize/sass/**/*.scss',
        config.vendor.vendorRoot + 'jquery.royalslider/jquery.royalslider.js',
        config.vendor.vendorRoot + 'jquery.royalslider/slider.css'
    ],
    ignoreFiles = [
        path.join(process.cwd(), config.vendor.vendorRoot + 'materialize/bin/materialize.css'),
        path.join(process.cwd(), config.vendor.vendorRoot + 'velocity/velocity-ui.js'),
        path.join(process.cwd(), config.vendor.vendorRoot + 'jquery/dist/jquery.js')
    ];

var filterByExtension = function(extension) {
    return filter(function(file) {
        return file.path.match(new RegExp('.' + extension + '$'));
    });
};

var jsvendor = function () {
    var filters = filterByExtension('js');
    return gulp.src(bowerFiles().concat(_.map(missing, function (s) {return path.join(process.cwd(), s);})))
        .pipe(ignore.exclude(ignoreFiles))
        .pipe(filters)
        .pipe(plumber())
        .pipe(concat('vendor.js'))
        .pipe(environment === 'production' ? uglify() : util.noop())
        .pipe(gulp.dest(config.js.distPath));
};

//var cssvendor = function () {
//    var filters = filterByExtension('css');
//    return gulp.src(bowerFiles().concat(_.map(missing, function (s) {return path.join(process.cwd(), s);})))
//        .pipe(ignore.exclude(ignoreFiles))
//        .pipe(filters)
//        .pipe(plumber())
//        .pipe(concat('vendor.css'))
//        .pipe(environment === 'production' ? csso() : util.noop())
//        .pipe(gulp.dest(distPathStyles));
//};

var cssvendor = function () {
    //var filters = filterByExtension('css');
    var vendorPathLen = path.join(process.cwd(), config.vendor.vendorRoot).length;
    var stylesVendorPathLen = path.join(process.cwd(), config.vendor.stylesVendorRoot).length;
    var files = bowerFiles().concat(_.map(missing, function (s) {return path.join(process.cwd(), s);}));
    var cssFiles = files.reduce(function(arr, c) { if (c.match(/(.css|.scss|.sass|.less)$/)) { arr.push(c.substring(vendorPathLen)); } return arr; }, []);
    function getBasePath (path) {
        var srcPath = path.substring(vendorPathLen);
        var maxLen = -1;
        var maxIndex = -1;
        cssFiles.forEach(function(cssFile, idx) {
            var i=0;
            if (srcPath == cssFile) {
                maxLen = cssFile.length - cssFile.replace(/^.*[\\\/]/, '').length;
                maxIndex = idx;
            } else {
                while(i<srcPath.length && srcPath.charAt(i)=== cssFile.charAt(i)) i++;
                if (i > maxLen) {maxLen = i; maxIndex = idx;}
            }
        });
        return config.vendor.vendorRoot + cssFiles[maxIndex].substring(0,maxLen);
    }

    function collect( file, memo ){
        var vendorName = file.path.substring(stylesVendorPathLen).replace(/[\\\/].*$/, '');
        if (!file.path.substring(stylesVendorPathLen + vendorName.length + 1).match(/[\\\/]/)) {
            memo[vendorName] = '@import "' + vendorName + '/' + file.path.substring(stylesVendorPathLen + vendorName.length + 2) + '";';
        }
        return memo;
    }

    function end( memo ){
        var output = '';
        for(var key in memo) {
            output += memo[key] + '\n';
        }
        return output;
    }

    return gulp.src(files)
        .pipe(ignore.exclude(ignoreFiles))
        .pipe(filter(function(file) {
            return file.path.match(new RegExp('(.css|.scss|.sass|.less)$'));
        }))
        .pipe(plumber())
        .pipe(foreach(function(stream, file) {
            //console.log(file.path);
            var vendorName = file.path.substring(vendorPathLen).replace(/[\\\/].*$/, '');
            //console.log(file.path, getBasePath(file.path));
            return gulp.src(file.path, {'base': getBasePath(file.path)})
                .pipe(rename(function (path) {
                    if (path.dirname === '.') {
                        path.basename = "_" + path.basename;
                        path.extname = ".scss"
                    }
                }))
                .pipe(gulp.dest(config.vendor.stylesVendorRoot + vendorName + '/'))
        }))
        .pipe(reduce('_index.scss', collect, end, {} ))
        .pipe(gulp.dest(config.vendor.stylesVendorRoot));
        //.pipe(gulp.dest('gulp/assets/stylesheets/vendor'));
};

var rsvendor = function () {
    var vendorPathLen = path.join(process.cwd(), config.vendor.vendorRoot).length;
    var files = bowerFiles().concat(_.map(missing, function (s) {return path.join(process.cwd(), s);}));
    var cssFiles = files.reduce(function(arr, c) { if (c.match(/.css$/)) { arr.push(c.substring(vendorPathLen)); } return arr; }, []);
    function getBasePath (path) {
        var srcPath = path.substring(vendorPathLen);
        var maxLen = -1;
        var maxIndex = -1;
        cssFiles.forEach(function(cssFile, idx) {
            var i=0;
            while(i<srcPath.length && srcPath.charAt(i)=== cssFile.charAt(i)) i++;
            if (i > maxLen) {maxLen = i; maxIndex = idx;}
        });
        return config.vendor.vendorRoot + cssFiles[maxIndex].substring(0,maxLen);
    }

    return gulp.src(files, {'base': config.vendor.vendorRoot})
        .pipe(filter(function(file) {
            return !(file.path.match(new RegExp('.css$')) || file.path.match(new RegExp('.js$')));
        }))
        .pipe(foreach(function(stream, file) {
            return gulp.src(file.path, {'base': getBasePath(file.path)})
                .pipe(gulp.dest('public/'));
        }));
};


gulp.task('js:vendor', function() {
    return jsvendor();
});

gulp.task('css:vendor', function() {
    return cssvendor();
});

gulp.task('rs:vendor', function() {
    return rsvendor();
});
