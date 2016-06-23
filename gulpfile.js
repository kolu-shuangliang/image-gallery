var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

gulp.task('default', ['styles'], function () {
    browserSync.init({
        server: {
            baseDir: './',
            index: 'index.html'
        }
    });

    gulp.watch('sass/**/*.scss', ['styles'])
        .on('change', function (event) {
            console.log('File' + event.path + ' was ' + event.type + ', running tasks... ');
        });

    gulp.watch('index.html').on('change', browserSync.reload);
    gulp.watch('js/**/*.js').on('change', browserSync.reload);
});

gulp.task('styles', function () {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});