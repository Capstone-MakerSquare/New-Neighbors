
// -------------------------------------
// This file processes all of the assets in the "client" folder and outputs the finished files in the "build" folder as a finished app.

// 1. LIBRARIES
// - - - - - - - - - - - - - - -

var gulp = require('gulp');
var del  = require('del');
// css modules
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var concatcss = require('gulp-concat-css');
var uglifycss = require('gulp-uglifycss');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
// js modules
var concat = require('gulp-concat');
// image modules
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
// server and live reload
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
// html
var htmlreplace = require('gulp-html-replace');

// 2. FILE PATHS
// - - - - - - - - - - - - - - -

var paths = {
  dist: '/',
  html: {
    main:'client/**/*.html',
    dist: 'dist'
  },
  css: {
    srcs: 'client/assets/css/**/*.css',
    main: 'client/assets/css/styles.css'
  },
  styles: {
    libsrcs: ['client/lib/slick-carousel/slick/slick.css','client/lib/slick-carousel/slick/slick-theme.css'],
    main: 'dist/assets/css',
    dist: 'dist/assets/*.css'
  },
  images: {
    main: 'client/assets/images/**/*',
    dist: 'dist/assets/images'
  },
  font: {
    main: 'client/assets/font/**/*',
    dist: 'dist/assets/font'
  },
  icons: {
    main: ['client/lib/foundation-icons/**/*'],
    dist: 'dist/lib'
  },
  slick: {
    main: 'client/lib/slick-carousel/**/*',
    dist:'dist/assets/slick-carousel'
  },
  services: {
    main: ['client/app/app.js', 'client/app/service.js','client/app/map/mapService.js', 'client/app/details/detailsService.js'],
    dist: 'dist/app'
  },
  scripts: {
    dist: 'dist/app',
    lib: 'client/lib/angular-slick/dist/slick.js',
    libdist: 'dist/lib',
    clientdist:['client/app/details/detailsController.js', 'client/app/thumbnails/thumbnailsController.js',
    'client/app/map/mapDirective.js', 'client/app/searchForm/searchFormDirective.js',
    'client/app/filter/filterDirective.js', 'client/app/thumbnails/thumbnailsDirective.js',
    'client/app/mainCtrl.js','client/app/charts/chartsController.js', 'client/app/charts/chartsDirective.js',
    'client/app/countup/countup.min.js', 'client/app/team/teamDirective.js']
  }
};

// 3. TASKS
// - - - - - - - - - - - - - - -

// cleans the dist directory
gulp.task('clean', function() {
  return del(['dist']);
});

// reloads html file on change
gulp.task('html',['clean'], function() {
    return gulp.src(paths.html.main)
    .pipe(gulp.dest(paths.html.dist))
    .pipe(livereload());
});

// moves icon files to dist
gulp.task('icons',['clean'], function() {
    return gulp.src(paths.icons.main)
    .pipe(gulp.dest(paths.styles.main));
});


// moves lib scripts to dist
gulp.task('libjs',['clean'], function() {
    return gulp.src(paths.scripts.lib)
    .pipe(gulp.dest(paths.scripts.libdist));
});

// dynamically replaces script files in html file
gulp.task('replacescripts', ['clean', 'html'], function() {
  return gulp.src('dist/index.html')
    .pipe(htmlreplace({
        'libcss': 'assets/css/lib.min.css',
        'css': 'assets/css/styles.min.css',
        'app': 'app/app.js',
        'js': 'app/app.min.js',
        'slick': 'lib/slick.js',
        'services': ['app/service.js', 'app/mapService.js', 'app/detailsService.js']
    }))
    .pipe(gulp.dest('dist'));
});

// moves font assets
gulp.task('font',['clean'], function() {
    return gulp.src(paths.font.main)
    .pipe(gulp.dest(paths.font.dist));
});

// move slick.js to dist
gulp.task('slick',['clean'], function() {
    return gulp.src(paths.slick.main)
    .pipe(gulp.dest(paths.slick.dist));
});

// moves services.js files
gulp.task('services',['clean'], function() {
    return gulp.src(paths.services.main)
    .pipe(gulp.dest(paths.services.dist));
});

//minifies and concats JS files
gulp.task('minjs', ['clean'], function() {
  return gulp.src(paths.scripts.clientdist)
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dist));
});

// reloads js file on change
gulp.task('js', ['clean'], function() {
  return gulp.src(paths.scripts.app)
    .pipe(gulp.dest(paths.scripts.appdist))
    .pipe(livereload());
});

// concats and minifies all css
gulp.task('css', ['clean'], function() {
  return gulp.src(paths.css.main)
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(concatcss('styles.min.css'))
    .pipe(uglifycss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.main))
    .pipe(livereload());
});

// minifies lib css files
gulp.task('libcss',['clean'], function() {
  return gulp.src(paths.styles.libsrcs)
    .pipe(concatcss('lib.min.css'))
    .pipe(uglifycss())
    .pipe(gulp.dest(paths.styles.main));
});

// minifies images
gulp.task('images', ['clean'], function () {
  return gulp.src(paths.images.main)
    .pipe(pngquant({quality: '65-80', speed: 4})())
    .pipe(gulp.dest(paths.images.dist));
});

// watches for changes
gulp.task('watch', function() {
  gulp.watch(paths.html.main, ['html']);
  gulp.watch(paths.scripts.app, ['minjs']);
  gulp.watch(paths.css.srcs, ['css']);
});

gulp.task('serve', function() {
  nodemon({ script: 'index.js', ignore: 'node_modules/**/*.js'});
});


// 4. RUN TASKS
// - - - - - - - - - - - - - - -

// task groupings
gulp.task('htmlTasks', ['html', 'replacescripts']);
gulp.task('cssTasks', ['css', 'libcss']);
gulp.task('jsTasks', ['minjs', 'libjs', 'services']);
gulp.task('assetsTasks', ['slick', 'font', 'icons', 'images']);

// run tasks
gulp.task('default', ['watch','serve']);
gulp.task('dist', ['htmlTasks','cssTasks','jsTasks','assetsTasks']);

