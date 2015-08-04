var gulp = require('gulp'),
    handlebars = require('gulp-compile-handlebars'),
    rename = require('gulp-rename'),
    /*gutil = require('gulp-util'),*/
    speaker = require('./src/data/data.json'),
    browserSync = require("browser-sync"),
    /*watch = require('gulp-watch'),*/
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

reload = browserSync.reload;

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        data: 'data/'
    },
    src: {
        html: 'src/*.html',
        template: 'src/template',
        js: 'src/js/main.js',
        style: 'src/style/main.scss',
        img: 'src/img/!**!/!*.*',
        fonts: 'src/fonts/!**!/!*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/!**!/!*.js',
        style: 'src/style/!**!/!*.scss',
        img: 'src/img/!**!/!*.*',
        fonts: 'src/fonts/!**/!*.*'
    },
    clean: './build'
};

var configServer = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "seven-prefix"
};

gulp.task('webserver', function () {
    browserSync(configServer);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('watch', function(){
    gulp.watch(path.watch.html, ['html:build']);
    gulp.watch(path.watch.style, ['style:build']);
    gulp.watch(path.watch.js, ['js:build']);
    gulp.watch(path.watch.img, ['img:build']);
    gulp.watch(path.watch.font, ['fonts:build']);
});

gulp.task('html:build', function() {

        var options = {
        batch : [path.src.template]
        };

        gulp.src(path.src.html)
            .pipe(handlebars(speaker, options))
            .pipe(rename("index.html"))
            .pipe(gulp.dest(path.build.html))
            .pipe(reload({stream: true}));

});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['src/style/'],
            outputStyle: 'compressed',
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('img:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


gulp.task('build', ['clean', 'html:build', 'js:build', 'style:build', 'img:build', 'fonts:build']);

gulp.task('default',['build', 'webserver', 'watch']);






