var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    header = require('gulp-header'),
    fs = require('fs'),
    pckg = require('./package.json');

var themes = [
    'blue',
    'black'
];

gulp.task('styles', function () {
    for (var i = 0; i < themes.length; i++) {
        gulp.src('src/assets/scss/bundle.scss', {base: '.'})
            .pipe(header(fs.readFileSync('src/assets/scss/colors/_' + themes[i] + '.scss'), {}))
            .pipe(sass({
                precision: 8,
                outputStyle: 'expanded'
            }).on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: pckg.browserslist,
                cascade: false
            }))
            .pipe(rename('tabler-' + themes[i] + '.css'))
            .pipe(gulp.dest('src/assets/css/'))
            .pipe(gulp.dest('../umicms-ready-made-solution/html/rms-corporation/src/css/libs'));
    }
});


gulp.task('styles-plugins', function () {
    return gulp.src('src/assets/plugins/**/plugin.scss', { base: '.' })
        .pipe(sass({
            precision: 6,
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: pckg.browserslist,
            cascade: false
        }))
        .pipe(rename(function(path) {
            path.extname = '.css';
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('watch', ['styles', 'styles-plugins'], function() {
    gulp.watch('src/assets/scss/**/*.scss', ['styles']);
    gulp.watch('src/assets/plugins/**/*.scss', ['styles-plugins']);
});

gulp.task('default', ['styles', 'styles-plugins']);