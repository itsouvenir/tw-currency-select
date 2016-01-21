var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var base64 = require('gulp-base64');

gulp.task('less', ['bower'], function() {
    gulp.src('./src/less/currencySelect.less')
        .pipe(less())
        .pipe(base64({
            extensions: ['png'],
            debug: true
        }))
        .pipe(minifyCSS())
        .pipe(rename('tw-currency-select.css'))
        .pipe(gulp.dest('./dist'));
});