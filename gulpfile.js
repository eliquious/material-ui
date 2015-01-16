// gulpfile

// Load the modules
var gulp = require('gulp');
var del = require('del'); // Deletes Files
var react = require('gulp-react'); // Transforms JSX to JS
var bower = require('gulp-bower'); // Bower
var uglify = require('gulp-uglify'); // Minifies JS
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var through = require('through2');
var ignore = require('gulp-ignore');
var concat = require('gulp-concat');

// Path defs
var paths = {
    dist: 'dist/',

    // React Components
    jsx_dest: 'dist/jsx/',
    jsx_src: ['src/js/**/*.{js,jsx}'],
};

// Utility functions
// Plumber handler which beeps on error
var errorHandler = function(error) {
    console.log(error.toString());
    process.stderr.write('\x07');
}

// Beeps on error
var JsLintBeepReporter = function() {
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            // return empty file
            cb(null, file);
        }
        if (!file.jshint.success) {
            process.stderr.write('\x07');
        }
        cb(null, file);
    });
};

// 'clean' deletes the dist directory
gulp.task('clean', function() {
    del(['dist/**']);
});

// 'jsx' transforms all the JSX into JS
gulp.task('jsx', function() {
    return gulp.src(paths.jsx_src)
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(changed(paths.jsx_dest, {
            extension: '.js'
        }))
        .pipe(react())
        // .pipe(jshint())
        // .pipe(jshint.reporter('jshint-stylish'))
        // .pipe(JsLintBeepReporter())
        // .pipe(uglify())
        .pipe(gulp.dest(paths.jsx_dest));
});

// 'bower' gathers all the bower_components and puts them in dist
// gulp.task('bower', function() {
//     return bower()
//         .pipe(gulp.dest(paths.dist));
// });

// 'watch' reruns 'css' and 'js' tasks when files are modified
gulp.task('watch', function() {
    gulp.watch(paths.jsx_src, ['jsx']);
    gulp.watch('./bower_components', ['bower']);
});

// material-ui React components in dependency order
var material = [
    'src/js/utils/events.js',
    'src/js/utils/dom.js',
    'src/js/mixins/classable.js',
    'src/js/mixins/click-awayable.js',
    'src/js/mixins/window-listenable.js',
    'src/js/paper.jsx',
    'src/js/tooltip.jsx',
    'src/js/icon.jsx',
    'src/js/ripples/circle.jsx',
    'src/js/ripples/focus-ripple.jsx',
    'src/js/ripples/touch-ripple.jsx',
    'src/js/utils/key-code.js',
    'src/js/enhanced-button.jsx',
    'src/js/icon-button.jsx',
    'src/js/app-bar.jsx',
    'src/js/app-canvas.jsx',
    'src/js/checkbox.jsx',
    'src/js/utils/css-event.js',
    'src/js/overlay.jsx',
    'src/js/dialog-window.jsx',
    'src/js/flat-button.jsx',
    'src/js/dialog.jsx',
    'src/js/utils/key-line.js',
    'src/js/toggle.jsx',
    'src/js/menu-item.jsx',
    'src/js/menu.jsx',
    'src/js/drop-down-icon.jsx',
    'src/js/drop-down-menu.jsx',
    'src/js/floating-action-button.jsx',
    'src/js/input.jsx',
    'src/js/left-nav.jsx',
    'src/js/radio-button.jsx',
    'src/js/raised-button.jsx',
    'src/js/slider.jsx',
    'src/js/snackbar.jsx',
    'src/js/table-header.jsx',
    'src/js/table-rows-item.jsx',
    'src/js/table-rows.jsx',
    'src/js/toolbar-group.jsx',
    'src/js/toolbar.jsx',
    'src/js/transition-groups/slide-in.jsx',
    'src/js/utils/date-time.js',
    'src/js/date-picker/day-button.jsx',
    'src/js/date-picker/calendar-month.jsx',
    'src/js/date-picker/calendar-toolbar.jsx',
    'src/js/date-picker/date-display.jsx',
    'src/js/date-picker/calendar.jsx',
    'src/js/date-picker/date-picker-dialog.jsx',
    'src/js/date-picker/date-picker.jsx',
    'src/js/tabs/tab.jsx',
    'src/js/tabs/tabTemplate.jsx',
    'src/js/ink-bar.jsx',
    'src/js/tabs/tabs.jsx'
];
gulp.task('material-min', function() {
    return gulp.src(material)
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(react({harmony: true}))
        .pipe(concat('material-ui-react.min.js'))
        .pipe(uglify())

        // .pipe(jshint())
        // .pipe(jshint.reporter('jshint-stylish'))
        // .pipe(JsLintBeepReporter())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('material', function() {
    return gulp.src(material)
        .pipe(plumber({
            errorHandler: errorHandler
        }))
        .pipe(react({harmony: true}))
        .pipe(concat('material-ui-react.js'))

        // .pipe(jshint())
        // .pipe(jshint.reporter('jshint-stylish'))
        // .pipe(JsLintBeepReporter())
        .pipe(gulp.dest(paths.dist));
});

// 'default' task builds all React components and starts file watchers
gulp.task('default', ['watch', 'build']);
// gulp.task('default', ['watch', 'bower', 'jsx', 'material', 'material:bundle']);

// 'build' performs all transformations and creates dist modules
gulp.task('build', ['jsx', 'material', 'material-min']);
