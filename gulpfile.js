var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var gulp = require('gulp');
var merge = require('merge-stream');

function templatesTask () {
    var tplHeader = 'angular.module("<%= module %>"<%= standalone %>).run(["$templateCache", function ($templateCache) {';
    return gulp.src(['./static/ng-app/templates/*.html']).pipe(templateCache({
        module: 'wsReports',
        templateHeader: tplHeader,
        templateFooter: '}]);'
    }))
}

gulp.task('scripts', function() {
    return merge(gulp.src(['./static/ng-app/src/*.js', './static/ng-app/src/**/*.js']), templatesTask())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./static/ng-app/build/'));
});

gulp.task('tpls', function () {
    templatesTask().pipe(gulp.dest('./static/ng-app/build'));
});

gulp.task('watch', function () {
    gulp.watch([
        './static/ng-app/src/**/*.js',
        './static/ng-app/src/*.js',
        './static/ng-app/templates/*.html'
    ], ['scripts']);
});

gulp.task('default', ['scripts']);