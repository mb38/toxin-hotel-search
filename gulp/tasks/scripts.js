const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');
const concat = require('gulp-concat');

// Работа со скриптами

module.exports = function script() {
    return gulp.src('dev/static/js/*.js')
        .pipe(concat('main.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulpif(argv.prod, uglify()))
        .pipe(gulp.dest('dist/static/js/'));
};
