//https://gist.github.com/danharper/3ca2273125f500429945
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var jshint = require('gulp-jshint');
var connect = require('gulp-connect');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var Server = require('karma').Server;


function bundle (main, src, dest, output, watch) {
    var bundler;
    if (watch) bundler = watchify(browserify(main, { debug: true }).transform(babel));
    else bundler = browserify(main, { debug: true }).transform(babel);

    function rebundle () {
        console.log("-> bundling");
        bundler.bundle()
            .on("error", function(err) { console.error(err); this.emit("end"); })
            .pipe(source(output))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest(dest));
    }
    if (watch) bundler.on("update", rebundle);
    rebundle();
}

gulp.task("connect", function () {
    connect.server({
        root: "build",
        livereload: true
    });
});
 
gulp.task("reconnect", function () {
    gulp.src("./build/**/*")
        .pipe(connect.reload());
});


gulp.task("lint", function () {
    gulp.src("./src/**/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

gulp.task("test", function (done) {
    new Server({
        configFile: __dirname + "/karma.conf.js", 
        singleRun: true
    }, done).start();
});

gulp.task("copy-web", function () {
    gulp.src("./web/**/*")
        .pipe(gulp.dest("./build"));
});

gulp.task("build", function () { 
    bundle("./src/index.js", ["src/**/*.js"], "./build", "bundle.js", false);
});

gulp.task("rebuild", function () { 
    bundle("./src/index.js", ["src/**/*.js"], "./build", "bundle.js", true);
});

gulp.task("watch", function () {
    gulp.watch(["./src/**/*.js", "./test/**/*.js"], ["test", "lint"]);
    gulp.watch(["./build/bundle.js"], ["reconnect"]);
});


gulp.task("default", ["copy-web", "rebuild", "lint", "test", "watch", "connect"]);
