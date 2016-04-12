var gulp = require('gulp');
var sass = require('gulp-sass');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('styles', function() {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./static/'));
});

/*gulp.task('compile', function() {
  return browserify({entries: './client/index.js', extensions: [".js"], debug: true})
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('static/'));
});*/

gulp.task('compile', function() {
  gulp.src('client/index.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('static'));
});

gulp.task('lint', function() {
  return gulp.src('./client/*.js')
    .pipe(eslint({
      config: '.eslint'
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('build', ['lint', 'compile', 'static', 'styles']);

gulp.task('copystatic', function() {
    gulp.src('./static/**/*')
    .pipe(gulp.dest('./dist'));
});

gulp.task('static', function() {
    gulp.src('./static/**/*.*')
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
	gulp.watch('./sass/**/*.scss', ['styles']);
  gulp.watch('./client/**/*.js', ['lint', 'compile']);
  gulp.watch('./static/**/*.*', ['static']);
});
