const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const imagemin = require('gulp-imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const notify = require("gulp-notify");

function htmlCopy(){
    return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dest'))
    .pipe(notify({
        message: 'HTMLをコピーしました',
        onLast: true,
    }));
}
function cssTranspile(){
    return gulp.src('src/sass/**/*.scss')
    .pipe(plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(sass())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(gulp.dest('dest/css'))
    .pipe(notify({
        message: 'Sassをコンパイルしました',
        onLast: true,
    }));
}
function imageCompress(){
    return gulp.src('src/img/**/*')
    .pipe(imagemin([
        imageminGifsicle({ optimizationLevel: 3 }),
        imageminMozjpeg({ quality: 80 }),
        imageminPngquant(),
        imageminSvgo({ plugins: [{
            name: 'removeViewBox',
            active: false,
        }]})
    ], { verbose: true } ))
    .pipe(gulp.dest('dest/img'))
    .pipe(notify({
        message: '画像を圧縮しました',
        onLast: true,
    }));
}
function browserSyncInit(){
    browserSync.init({
        server: {
            baseDir: 'dest',
        },
    });
}
function browserSyncReload(callback){
    browserSync.reload();
    callback();
}
function watchFiles(){
    gulp.watch('src/**/*.html',      gulp.series(htmlCopy, browserSyncReload));
    gulp.watch('src/sass/**/*.scss', gulp.series(cssTranspile, browserSyncReload));
    gulp.watch('src/img/**/*',       gulp.series(imageCompress, browserSyncReload));
}

exports.default = gulp.series(
    htmlCopy, cssTranspile, imageCompress,
    gulp.parallel(browserSyncInit, watchFiles)
    );