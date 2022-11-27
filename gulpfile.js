const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const minifyjs = require('gulp-js-minify');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task('clean', function () {
  return gulp.src('dist/*', {read: false})
      .pipe(clean());
});

gulp.task('prepare-css', (cb) => {
    gulp
    .src('./src/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.min.css'))
    .pipe(autoprefixer({
			cascade: false,
      grid: "autoplace"
		}))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    
    .pipe(gulp.dest('dist/style'));
    cb()
})

gulp.task('prepare-js', (cb) => {
    gulp
    .src('./src/scripts/*.js')
    .pipe(concat('scripts.min.js'))
    .pipe(minifyjs())
    .pipe(gulp.dest('dist/script'));
    cb()
})


gulp.task('prepare-img', (cb) => {
	gulp.src('src/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));
    cb()
});

gulp.task('serve', function() {

  browserSync.init({
      server: "./"
  });

  gulp.watch('src/**/*', gulp.parallel('prepare-img', 'prepare-css', 'prepare-js'));
  gulp.watch('./**/*').on('change', reload);
});


exports.build = gulp.series('clean', gulp.parallel( 'prepare-img', 'prepare-css', 'prepare-js')); 
exports.dev = gulp.series('serve');