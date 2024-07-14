const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
// const groupMedia = require('gulp-group-css-media-queries');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
// const babel = require('gulp-babel');
// const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');


//__________  Тестовый таск  __________//
gulp.task('hello', (done) => {
    console.log('Hello from gulp');
    done();
});


//__________  Обработка HTML  __________//
gulp.task('html:dev', () => {
    return gulp
        .src(['./src/html/**/*.html', '!./src/html/blocks/*.html']) // --- С помощью занка ! исключаем файлы для обработки
        .pipe(changed('./build/', { hasChanged: changed.compareContents }))
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'HTML',
                message: 'Error <%= error.message %>',
                sound: false
            })
        }))
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./build/'))
});


//__________  Компиляция SCSS  __________//
gulp.task('sass:dev', () => {
    return gulp
        .src('./src/scss/*.scss')
        .pipe(changed('./build/css/'))
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'Styles',
                message: 'Error <%= error.message %>',
                sound: false
            })
        }))
        .pipe(sourceMaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./build/css/'))
});


//__________  Изображения  __________//
gulp.task('images:dev', () => {
    return gulp
        .src('./src/images/**/*')
        .pipe(changed('./build/images/'))
        // .pipe(imagemin({ verbose: true })) --- Не нужен в DEV-режиме
        .pipe(gulp.dest('./build/images/'))
});


//__________  Шрифты  __________//
gulp.task('fonts:dev', () => {
    return gulp
        .src('./src/fonts/**/*')
        .pipe(changed('./build/fonts/'))
        .pipe(gulp.dest('./build/fonts/'))
});


//__________  Reset стили  __________//
gulp.task('reset:dev', () => {
    return gulp
        .src('./src/reset/**/*.css')
        .pipe(changed('./build/css/'))
        .pipe(gulp.dest('./build/css/'))
});


//__________  Файлы  __________//
gulp.task('files:dev', () => {
    return gulp
        .src('./src/files/**/*')
        .pipe(changed('./build/files/'))
        .pipe(gulp.dest('./build/files/'))
});


//__________  Сервер  __________//
gulp.task('server:dev', () => {
    return gulp
        .src('./build/')
        .pipe(server({
            livereload: true,
            open: true
        }))
});


//__________  JS  __________//
gulp.task('js:dev', () => {
    return gulp
        .src('./src/js/*.js')
        .pipe(changed('./build/js/'))
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'JS',
                message: 'Error <%= error.message %>',
                sound: false
            })
        }))
        // .pipe(babel()) --- Не нужен в DEV-режиме
        .pipe(webpack(require('../webpack.config')))
        .pipe(gulp.dest('./build/js/'))
})


//__________  Удаление папки dist  __________//
gulp.task('clean:dev', (done) => {
    if (fs.existsSync('./build/')) {
        return gulp
            .src('./build/', { read: false })
            .pipe(clean())
    }
    done();
});


//__________  Слежение за файлами  __________//
gulp.task('watch:dev', () => {
    gulp.watch('./src/**/*.html', gulp.parallel('html:dev'));
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
    gulp.watch('./src/images/**/*', gulp.parallel('images:dev'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
    gulp.watch('./src/reset/**/*.css', gulp.parallel('reset:dev'));
    gulp.watch('./src/files/**/*', gulp.parallel('files:dev'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
});



