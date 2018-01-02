const gulp = require('gulp')
const watch = require('gulp-watch')
const changeJson = require('./gulp-tools/changeJson')

gulp.task('change-json', pipes.bind(gulp.src('dist/app.json')))

gulp.task('watch', ['change-json'], pipes.bind(watch('dist/app.json')))

function pipes () {
    return this
        .pipe(changeJson())
        .pipe(gulp.dest('dist'))
}
