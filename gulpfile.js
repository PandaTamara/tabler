var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    header = require('gulp-header'),
    fs = require('fs'),
    diff  = require('gulp-css-overrides'),
    cssDiff = require('@romainberger/css-diff'),
    pckg = require('./package.json');

/**
 * Папка с файлами, в которых хранятся цветовые переменные для тем
 */
var themes = fs.readdirSync('src/assets/scss/colors/').filter(function(elem) {
    if (elem !== 'default.scss') {
        return true;
    }
});

/**
 * TODO
 * @type {{bootstrapDir: string, publicDir: string}}
 */
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
        .pipe(autoprefixer({
            browsers: pckg.browserslist,
            cascade: false
        }))
        //.pipe(cssDiff('src/assets/css/colors/_black.css'))
        .pipe(rename('tabler.css'))
        .pipe(gulp.dest('src/assets/css/'))
        .pipe(gulp.dest('../umicms-ready-made-solution/html/rms-corporation/src/css/libs'));
});

/**
 * Для каждого цвета сначала генерируется полноценный tabler с цветом
 * Потом в результате сравнения оставляются только нужные цвета
 */
gulp.task('colors', function () {
    for (var i = 0; i < themes.length; i++) {
        gulp.src('src/assets/scss/bundle.scss', {base: '.'})
            .pipe(header(fs.readFileSync('src/assets/scss/colors/' + themes[i]), {}))
            .pipe(sass({
                precision: 8,
                outputStyle: 'expanded'
            }).on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: pckg.browserslist,
                cascade: false
            }))
            .pipe(
                diff({
                    basefile: 'src/assets/css/tabler.css'
                })
            )
            .pipe(rename(themes[i].split('.')[0] + '.css'))
            .pipe(gulp.dest('src/assets/css/colors/'))
            .pipe(gulp.dest('../umicms-ready-made-solution/html/rms-corporation/src/css/libs/colors'));
    }

    // После того, как схема сформирована удаляем цвета из базы
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
gulp.task('default', ['core', 'colors']);