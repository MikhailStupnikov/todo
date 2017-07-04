var gulp = require('gulp'),
	wiredep = require('wiredep').stream,
	pug = require('gulp-pug'),
	prettify = require('gulp-html-prettify'),
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