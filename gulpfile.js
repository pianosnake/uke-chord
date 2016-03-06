var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');

gulp.task('default', ['vulcanize', 'copy-polyfill']);

gulp.task('vulcanize', function(){
  return gulp.src('./uke-chord.html')
    .pipe(vulcanize({
    strip: true
  }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy-polyfill', function(){
  return gulp.src('bower_components/webcomponentsjs/webcomponents-lite.min.js')
    .pipe(gulp.dest('dist/'));
});