var gulp = require('gulp');
var sass = require('gulp-sass');
var fs = require('fs');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var clean = require('gulp-clean');
var gm = require('gulp-gm');

gulp.task('default', ['sass-styles', 'folder-structure'], function () {
    browserSync.init({
        server: {
            baseDir: './',
            index: 'index.html'
        }
    });

    gulp.watch('index.html').on('change', browserSync.reload);
    gulp.watch('sass/**/*.scss', ['sass-styles']).on('change', browserSync.reload);
    gulp.watch('js/**/*.js').on('change', browserSync.reload);
});

gulp.task('sass-styles', function () {
    return gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

gulp.task('folder-structure', function(){
    var gallery = './images/gallery';
    console.log('Scanning folders inside '+gallery+' \n');

    var result = {};
	var folders = fs.readdirSync(gallery);

	for (var i = 0; i < folders.length; i++) {
		var files = fs.readdirSync(gallery + '/' + folders[i]);
		result[folders[i]] = files;
	}
    fs.writeFile('./images/folder-structure.js', 'var folderStructure = ' + JSON.stringify(result));
});

gulp.task('thumbnails-clean', function(){
    return gulp.src('images/thumb_gallery', {read: false})
        .pipe(clean());
});
gulp.task('thumbnails-generate', ['thumbnails-clean'], function(){
    return gulp.src('images/gallery/**/*.{jpg,png}')
        .pipe(gm(function(gmfile){
            return gmfile.resize(200, 200);
        }))
        .pipe(gulp.dest('images/thumb_gallery'));
});
