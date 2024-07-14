const gulp = require('gulp');


// HTML //
const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');



// SASS //
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');



const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const groupMedia = require('gulp-group-css-media-queries');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');

// IMAGES //
const imagemin = require('gulp-imagemin');
// const webp = require('gulp-webp');
const changed = require('gulp-changed');


//__________  Тестовый таск  __________//
gulp.task('hello', (done) => {
    console.log('Hello from gulp');
    done();
});


//__________  Обработка HTML  __________//
gulp.task('html:docs', () => {
    return gulp
        .src(['./src/html/**/*.html', '!./src/html/blocks/*.html']) // --- С помощью занка ! исключаем файлы для обработки
        .pipe(changed('./docs/'))
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
        .pipe(htmlclean())
        .pipe(gulp.dest('./docs/'))
});


//__________  Компиляция SCSS  __________//
gulp.task('sass:docs', () => {
    return gulp
        .src('./src/scss/*.scss')
        .pipe(changed('./docs/css/'))
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'Styles',
                message: 'Error <%= error.message %>',
                sound: false
            })
        }))
        .pipe(sourceMaps.init())
        .pipe(autoprefixer())
        .pipe(sassGlob())
        .pipe(groupMedia())
        .pipe(sass())
        .pipe(csso())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./docs/css/'))
});


//__________  Изображения  __________//
gulp.task('images:docs', () => {
    return gulp
        .src('./src/images/**/*')
        .pipe(changed('./docs/images/'))
        // .pipe(webp()) --- Не работает из-за подключения
        .pipe(imagemin({ verbose: true }))
        .pipe(gulp.dest('./docs/images/'))

        // .src('./src/images/**/*')
        // .pipe(changed('./docs/images/')) --- Не работает из-за подключения
        // .pipe(imagemin({ verbose: true }))
        // .pipe(gulp.dest('./docs/images/'))
});


//__________  Шрифты  __________//
gulp.task('fonts:docs', () => {
    return gulp
        .src('./src/fonts/**/*')
        .pipe(changed('./docs/fonts/'))
        .pipe(gulp.dest('./docs/fonts/'))
});


//__________  Reset стили  __________//
gulp.task('reset:docs', () => {
    return gulp
        .src('./src/reset/**/*.css')
        .pipe(changed('./docs/css/'))
        .pipe(gulp.dest('./docs/css/'))
});


//__________  Файлы  __________//
gulp.task('files:docs', () => {
    return gulp
        .src('./src/files/**/*')
        .pipe(changed('./docs/files/'))
        .pipe(gulp.dest('./docs/files/'))
});


//__________  Сервер  __________//
gulp.task('server:docs', () => {
    return gulp
        .src('./docs/')
        .pipe(server({
            livereload: true,
            open: true
        }))
});


//__________  JS  __________//
gulp.task('js:docs', () => {
    return gulp
        .src('./src/js/*.js')
        .pipe(changed('./docs/js/'))
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'JS',
                message: 'Error <%= error.message %>',
                sound: false
            })
        }))
        .pipe(babel())
        .pipe(webpack(require('../webpack.config')))
        .pipe(gulp.dest('./docs/js/'))
})


//__________  Удаление папки docs(dist)  __________//
gulp.task('clean:docs', (done) => {
    if (fs.existsSync('./docs/')) {
        return gulp
            .src('./docs/', { read: false })
            .pipe(clean())
    }
    done();
});


//__________  Слежение за файлами  __________//
// gulp.task('watch:docs', () => {
//     gulp.watch('./src/**/*.html', gulp.parallel('html:docs'));
//     gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:docs'));
//     gulp.watch('./src/images/**/*', gulp.parallel('images:docs'));
//     gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:docs'));
//     gulp.watch('./src/reset/**/*.css', gulp.parallel('reset:docs'));
//     gulp.watch('./src/files/**/*', gulp.parallel('files:docs'));
//     gulp.watch('./src/js/**/*.js', gulp.parallel('js:docs'));
// });



