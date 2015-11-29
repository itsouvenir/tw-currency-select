var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');

gulp.task('less', ['bower'], function() {
    gulp.src('./src/less/currencySelect.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(rename('tw-currency-select.css'))
        .pipe(gulp.dest('./dist'));
});