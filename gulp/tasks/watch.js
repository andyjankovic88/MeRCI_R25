/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp   = require('gulp');
var config = require('../config');
var watch  = require('gulp-watch');
var browserSync = require('browser-sync');

gulp.task('watch', function(callback) {
    browserSync(config.browserSync);
    gulp.watch([config.sass.src, '!' + config.vendor.stylesVendorRoot + '**/*'], ['sass-watch']);
    gulp.watch(config.js.watchFiles, ['js-watch']);
    gulp.watch(config.vendor.vendorRoot, ['vendor-watch']);
    gulp.watch(config.iconFont.src, ['iconFont']);
    //watch(config.sass.src, function() { gulp.start('sass'); browserSync.reload});
    //watch(config.images.src, function() { gulp.start('images'); });

    // Watchify will watch and recompile our JS, so no need to gulp.watch it
});

gulp.task('sass-watch', ['sass'], browserSync.reload);
gulp.task('js-watch', ['js'], browserSync.reload);
gulp.task('vendor-watch', ['js', 'sass', 'rs:vendor'], browserSync.reload);