const gulp = require('gulp');
const { exec } = require('child_process');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const path = require('path');

// Paths configuration
const paths = {
  scripts: {
    src: 'dist/**/*.js',
    dest: 'dist/js/'
  },
  html: {
    src: 'dist/**/*.html',
    dest: 'dist/'
  }
};

// Clean the output directory
function cleanDist() {
  return del(['dist']);
}

// Run Angular build
function angularBuild(cb) {
  exec('ng build --prod', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

// Minify and concatenate JS files
function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

// Minify HTML files
function html() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.html.dest));
}

// Watch for changes
function watchFiles() {
  gulp.watch('src/**/*.ts', gulp.series(build, scripts, html));
  gulp.watch('src/**/*.html', gulp.series(build, scripts, html));
}

// Define complex tasks
const build = gulp.series(cleanDist, angularBuild);
const watch = gulp.series(build, gulp.parallel(watchFiles));

// Export tasks
exports.clean = cleanDist;
exports.build = build;
exports.scripts = scripts;
exports.html = html;
exports.watch = watch;
exports.default = build;
