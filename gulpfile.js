var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('bs-reload', function (done) {
    browserSync.reload();
    done();
});

// use default task to launch Browsersync and watch JS files
gulp.task('bs-serve', [], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index.html"
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("js/*.js", ['bs-reload']);
    gulp.watch("*.js", ['bs-reload']);
    gulp.watch("assets/stylesheets/*.css", ['bs-reload']);
    gulp.watch("*.html", ['bs-reload']);
});


// Browser sync quit
gulp.task('bs-exit', function (done) {
    browserSync.exit();
    done();
});