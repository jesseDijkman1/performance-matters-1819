const gulp = require("gulp");
const gulpConcat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const cleanCSS = require("gulp-clean-css");

gulp.task("js:min", () => {
  return gulp.src("src/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("public/js"));
})

gulp.task("css:min", () => {
  return gulp.src("src/css/*.css")
    .pipe(cleanCSS())
    .pipe(gulp.dest("public/css"));
});
