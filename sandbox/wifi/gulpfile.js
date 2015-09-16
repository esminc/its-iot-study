var gulp = require('gulp');
var template = require('gulp-template');
require('dotenv').load();

gulp.task('default', function () {
    return gulp.src('wifi.js')
        .pipe(template(
            {
                WIFI_SSID: process.env.WIFI_SSID,
                WIFI_PASSWORD: process.env.WIFI_PASSWORD,
                WIFI_SECURITY: process.env.WIFI_SECURITY,
                WIFI_TIMEOUTS: process.env.WIFI_TIMEOUTS
            }))
        .pipe(gulp.dest('dist'));
});
