// Include gulp
var gulp = require('gulp');

// Include Gulp Plugins
var bower = require('gulp-bower');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var jshint = require('gulp-jshint');
var KarmaServer = require('karma').Server;
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');


//used for releasing
require('gulp-release-tasks')(gulp);

gulp.task('lint', function() {
   return gulp.src('src/*.js')
       .pipe(jshint({
           "browserify": true
       }))
       .pipe(jshint.reporter('default'));
});

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest('libs/'));
});

gulp.task('less', function() {
    gulp.src('./src/less/currencySelect.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(rename('tw-currency-select.css'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('test', function(done) {
    var karmaServer = new KarmaServer({
        configFile: __dirname + '/test/config/karma.conf.js',
        singleRun: true
    }, done);
    karmaServer.start();
});

gulp.task('templates', function () {
    return gulp.src('src/templates/*.html')
        .pipe(templateCache('tw-currency-select-templates.js', {
            standalone: true,
            module: 'tw-currency-select-templates',
            root: 'templates/',
            moduleSystem: 'Browserify'
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('dist', function() {

    var b = browserify();
    var path = './src/twCurrencySelectModule.js';
    b.add(path);
    return b.bundle()
        .pipe(source(path))
        .pipe(buffer())
        .pipe(rename('tw-currency-select.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(rename('tw-currency-select.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', function(callback) {
    runSequence(['lint', 'bower', 'less', 'templates'],
        'test',
        'dist',
        callback);
});
