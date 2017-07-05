var gulp = require('gulp'),
	wiredep = require('wiredep').stream,
	pug = require('gulp-pug'),
	prettify = require('gulp-html-prettify'),
	del = require('del'),
	useref = require('gulp-useref'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css'),
	browserSync = require('browser-sync');

gulp.task('pug', function() {
	gulp.src('app/pug/index.pug')
		.pipe(pug())
		.pipe(prettify({indent_char: '	', indent_size: 1}))
		.pipe(wiredep({
			ignorePath: '../'
		}))
		.pipe(gulp.dest('app/'));
});

gulp.task('bower', function() {
	gulp.src('app/index.html')
		.pipe(wiredep())
		.pipe(gulp.dest('app/'));
});

gulp.task('server', ['pug'], function() {
	browserSync({
		port: 9000,
		server: {
			baseDir: 'app'
		}
	});
});

gulp.task('reload', ['server'], function() {
	gulp.watch('app/pug/index.pug', ['pug']);
	gulp.watch([
		'app/*.html',
		'app/css/*.css',
		'app/js/*.js'
	]).on('change', browserSync.reload);
});



// ========== СБОРКА ==========
gulp.task('useref', function() {
	gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulp.dest('dist/'));
});

gulp.task('php', function() {
	gulp.src('app/php/*')
		.pipe(gulp.dest('dist/php'));
});

gulp.task('js', function() {
	gulp.src('app/js/main.js')
		.pipe(gulp.dest('dist/js/'));
});

gulp.task('clean', function() {
	del.sync('dist/');
});

gulp.task('build', ['clean', 'useref', 'js', 'php']);