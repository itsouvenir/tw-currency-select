var gulp = require('gulp');


gulp.task('watch', function() {
    gulp.watch(['src/*.js', 'src/templates/*.html'], ['browserify', 'karma']);
    gulp.watch(['less/*.less'], ['less']);
});
