var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    header = require('gulp-header'),
    fs = require('fs'),
    grader = require('gulp-css-grader'),
    cleanCSS = require('gulp-clean-css'),
    pckg = require('./package.json');


var config = {
    bootstrapDir: './bower_components/bootstrap-sass',
    publicDir: './public',
};

/**
 * Генерация базового стиля. В качестве цветов используются базовые стили bootstrap
 */
gulp.task('core', function () {
    gulp.src('src/assets/scss/bundle.scss', {base: '.'})
        .pipe(header(fs.readFileSync('src/assets/scss/colors/default.scss'), {}))
        .pipe(sass({
            precision: 8,
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(rename('tabler-test.css'))
        .pipe(gulp.dest('src/assets/css/'))
        .pipe(gulp.dest('../mustang-professional/html/parimir/app/_src/css/libs/'));
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


gulp.task('watch', ['colors', 'styles-plugins'], function() {
    gulp.watch('src/assets/scss/**/*.scss', ['styles']);
    gulp.watch('src/assets/plugins/**/*.scss', ['styles-plugins']);
});

//'styles-plugins'
gulp.task('default', ['core']);
