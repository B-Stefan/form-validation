var gulp = require("gulp")
var reactify = require("gulp-reactify")
var babel = require("gulp-babel")
gulp.task('build-npm', function(){
  gulp.src('./lib/**/*.js')
    .pipe(reactify())
    .pipe(babel())
    .pipe(gulp.dest('./build'))
});
