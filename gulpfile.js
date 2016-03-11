var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var replace = require('gulp-replace');



gulp.task('fix-paths-for-vulcanize', function(){
  return gulp.src('./uke-chord.html')
    .pipe(replace('../polymer', '../bower_components/polymer'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('vulcanize', ['fix-paths-for-vulcanize'], function(){
  return gulp.src('dist/uke-chord.html')
    .pipe(vulcanize({
    strip: true
  }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy-polyfill', function(){
  return gulp.src('bower_components/webcomponentsjs/webcomponents-lite.min.js')
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['fix-paths-for-vulcanize', 'vulcanize',  'copy-polyfill']);
