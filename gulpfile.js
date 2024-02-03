const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const rev = require("gulp-rev");
const uglify = require("gulp-uglify-es").default;
const del = require("del");

gulp.task("css", function (done) {
  console.log("minifying css...");
  gulp
    .src("./assests/sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cssnano())
    .pipe(gulp.dest("./assests/css"));

  gulp
    .src("./assests/**/*.css")
    .pipe(rev())
    .pipe(gulp.dest("./public/assests/"))
    .pipe(
      rev.manifest("public/assests/rev-manifest.json", {
        base: "./public/assests",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assests/"));
  done();
});

gulp.task("js", function (done) {
  console.log("minifying js...");
  gulp
    .src("./assests/**/*.js")
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest("./public/assests/"))
    .pipe(
      rev.manifest("public/assests/rev-manifest.json", {
        base: "./public/assests",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assests/"));

  done();
});

// empty the public/assests directory
gulp.task("clean:assets", function (done) {
  del.sync("./public/assets");
  done();
});

gulp.task("build", gulp.series("clean:assets", "css", "js"), function (done) {
  console.log("Building assets");
  done();
});
