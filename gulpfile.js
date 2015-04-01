var gulp = require("gulp")
var reactify = require("gulp-reactify")
var es6transpiler = require("gulp-es6-transpiler")
gulp.task('build-npm', function(){
  gulp.src('./lib/**/*.js')
    .pipe(reactify())
    .pipe(es6transpiler())
    .pipe(gulp.dest('./build'))
});
