/* jshint node: true */
'use strict';

/**
 * Module dependencies
 */

// Node.js core.
var fs = require('fs');

// Public node modules.
var bower = require('./bower');
var es = require('event-stream');
var Queue = require('streamqueue');
var lazypipe = require('lazypipe');
var stylish = require('jshint-stylish');
var historyApiFallback = require('connect-history-api-fallback');
var gulp = require('gulp');
var replace = require('gulp-replace-task');
var g = require('gulp-load-plugins')({
  lazy: false
});

// Needed.
var settings;
var configGeneralFile;
var noop = g.util.noop;
var isWatching = false;
var environment = 'development';
var htmlminOpts = {
  removeComments: true,
  collapseWhitespace: true,
  removeEmptyAttributes: false,
  collapseBooleanAttributes: true,
  removeRedundantAttributes: true
};

// Try to read frontend configuration file.
settings = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));

// API Prefix.
try {
  // Try to read `/config/general.json` file of the Strapi app.
  configGeneralFile = fs.readFileSync('../../../config/general.json', 'utf8');

  // Parse JSON.
  configGeneralFile = JSON.parse(configGeneralFile);

  var apiPrefix = configGeneralFile.prefix;

  if (apiPrefix) {
    settings.development.backendUrl = apiPrefix;
    settings.production.backendUrl = apiPrefix;
  }
} catch (err) {
  // Unable to read the `/config/general.json` file of the Strapi app.
}

/**
 * JS Hint
 */

gulp.task('jshint', function () {
  return gulp.src([
    './gulpfile.js',
    './src/**/*.js'
  ])
    .pipe(g.cached('jshint'))
    .pipe(jshint('./.jshintrc'))
    .pipe(livereload());
});

/**
 * CSS
 */

gulp.task('clean-css', function () {
  return gulp.src('./.tmp/css').pipe(g.clean());
});

gulp.task('styles', ['clean-css'], function () {
  return gulp.src([
    './src/**/*.scss',
    '!./src/**/_*.scss'
  ])
    .pipe(g.sass())
    .pipe(replace({
      patterns: [{
        match: 'backendUrl',
        replacement: settings[environment].backendUrl
      }, {
        match: 'frontendUrl',
        replacement: settings[environment].frontendUrl
      }]
    }))
    .pipe(gulp.dest('./.tmp/css/'))
    .pipe(g.cached('built-css'))
    .pipe(livereload());
});

gulp.task('styles-dist', ['styles'], function () {
  return cssFiles().pipe(dist('css', bower.name));
});

/**
 * Scripts
 */

gulp.task('scripts-dist', ['templates-dist'], function () {
  return appFiles().pipe(dist('js', bower.name, {
    ngAnnotate: true
  }));
});

/**
 * Templates
 */

gulp.task('templates', function () {
  return templateFiles().pipe(buildTemplates());
});

gulp.task('templates-dist', function () {
  return templateFiles({
    min: true
  }).pipe(buildTemplates());
});

/**
 * Vendors
 */
gulp.task('vendors', function () {
  var bowerStream = g.bowerFiles();
  environment = 'production';
  return es.merge(
    bowerStream.pipe(g.filter('**/*.css')).pipe(dist('css', 'vendors')),
    bowerStream.pipe(g.filter('**/*.js')).pipe(dist('js', 'vendors'))
  );
});

/**
 * Index
 */

gulp.task('index', index);
gulp.task('build-all', ['styles', 'templates'], index);

function index() {
  var opt = {
    read: false
  };

  return gulp.src('./src/index.html')
    .pipe(g.inject(g.bowerFiles(opt), {
      ignorePath: 'bower_components',
      starttag: '<!-- inject:vendor:{{ext}} -->'
    }))
    .pipe(g.inject(es.merge(appFiles(), cssFiles(opt)), {
      ignorePath: ['.tmp', 'src']
    }))
    .pipe(g.embedlr())
    .pipe(replace({
      patterns: [{
        match: 'backendUrl',
        replacement: settings[environment].backendUrl
      }, {
        match: 'frontendUrl',
        replacement: settings[environment].frontendUrl
      }]
    }))
    .pipe(gulp.dest('./.tmp/'))
    .pipe(livereload());
}

/**
 * Assets
 */

gulp.task('assets', function () {
  return gulp.src('./src/assets/**')
    .pipe(gulp.dest('./dist/assets'));
});

/**
 * Partials
 */
gulp.task('partials', function () {
  return gulp.src('./src/partials/**')
    .pipe(gulp.dest('./dist/partials'));
});

/**
 * Fonts
 */
gulp.task('fonts', function () {
  return gulp.src(['./bower_components/font-awesome/fonts/**',
    './bower_components/angular-ui-grid/ui-grid.ttf',
    './bower_components/angular-ui-grid/ui-grid.woff'])
    .pipe(gulp.dest('./dist/fonts'));
});

/**
 * Dist
 */

gulp.task('dist', ['vendors', 'assets', 'fonts', 'styles-dist', 'scripts-dist'], function () {
  environment = 'production';
  return gulp.src('./src/index.html')
    .pipe(g.inject(gulp.src('./dist/vendors.min.{js,css}'), {
      ignorePath: 'dist',
      starttag: '<!-- inject:vendor:{{ext}} -->',
      addPrefix: 'admin'
    }))
    .pipe(g.inject(gulp.src('./dist/' + bower.name + '.min.{js,css}'), {
      ignorePath: 'dist',
      addPrefix: 'admin'
    }))
    .pipe(replace({
      patterns: [{
        match: 'backendUrl',
        replacement: settings.production.backendUrl
      }, {
        match: 'frontendUrl',
        replacement: settings.production.frontendUrl
      }]
    }))
    .pipe(g.htmlmin(htmlminOpts))
    .pipe(gulp.dest('./dist/'));
});

/**
 * Static file server
 */
gulp.task('statics', g.serve({
  port: settings.frontend.ports.development,
  root: ['./.tmp', './src', './bower_components'],
  middleware: function (req, res, next) {
    environment = 'development';
    return historyApiFallback({})(req, res, next);
  }
}));

/**
 * Production file server, note remember to run 'gulp dist' first!
 */
gulp.task('production', g.serve({
  port: settings.frontend.ports.production,
  root: ['./dist'],
  middleware: function (req, res, next) {
    environment = 'production';
    return historyApiFallback({})(req, res, next);
  }
}));

/**
 * Watch
 */

gulp.task('serve', ['watch']);

gulp.task('watch', ['statics', 'default'], function () {
  isWatching = true;
  environment = 'development';

  // Initiate livereload server:
  g.livereload();

  gulp.watch('./src/**/*.js', ['jshint']).on('change', function (evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    }
  });

  gulp.watch('./src/index.html', ['index']);
  gulp.watch(['./src/**/*.html', '!./src/index.html'], ['templates']);
  gulp.watch(['./src/**/*.scss'], ['styles']).on('change', function (evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    }
  });
});

/**
 * Default task
 */
gulp.task('default', ['lint', 'build-all']);

/**
 * Lint everything
 */
gulp.task('lint', ['jshint', 'styles']);

/**
 * Test
 */
gulp.task('test', ['templates'], function () {
  return testFiles()
    .pipe(g.karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }));
});

/**
 * Inject all files for tests into karma.conf.js
 * to be able to run `karma` without gulp.
 */
gulp.task('karma-conf', ['templates'], function () {
  return gulp.src('./karma.conf.js')
    .pipe(g.inject(testFiles(), {
      starttag: 'files: [',
      endtag: ']',
      addRootSlash: false,
      transform: function (filepath, file, i, length) {
        return '  \'' + filepath + '\'' + (i + 1 < length ? ',' : '');
      }
    }))
    .pipe(gulp.dest('./'));
});

/**
 * Test files
 */
function testFiles() {
  return new Queue({
    objectMode: true
  })
    .queue(g.bowerFiles().pipe(g.filter('**/*.js')))
    .queue(gulp.src('./bower_components/angular-mocks/angular-mocks.js'))
    .queue(appFiles())
    .queue(gulp.src('./src/**/*_test.js'))
    .done();
}

/**
 * All CSS files as a stream
 */

function cssFiles(opt) {
  return gulp.src('./.tmp/css/**/*.css', opt);
}

/**
 * All Angular.js application files as a stream
 */
function appFiles() {
  var files = [
    './.tmp/' + bower.name + '-templates.js',
    './src/**/*.js',
    '!./src/**/*_test.js'
  ];

  return gulp.src(files)
    .pipe(g.angularFilesort());
}

/**
 * All Angular.js templates/partials as a stream
 */

function templateFiles(opt) {
  return gulp.src(['./src/**/*.html', '!./src/index.html'], opt)
    .pipe(opt && opt.min ? g.htmlmin(htmlminOpts) : noop());
}

/**
 * Build Angular.js templates/partials
 */
function buildTemplates() {
  return lazypipe()
    .pipe(g.ngHtml2js, {
      moduleName: bower.name + '-templates',
      prefix: '/' + bower.name + '/',
      stripPrefix: '/assets'
    })
    .pipe(g.concat, bower.name + '-templates.js')
    .pipe(gulp.dest, './.tmp')
    .pipe(livereload)();
}

/**
 * Concat, rename, minify
 *
 * @param {String} ext
 * @param {String} name
 * @param {Object} opt
 */

function dist(ext, name, opt) {
  opt = opt || {};

  return lazypipe()
    .pipe(g.concat, name + '.' + ext)
    .pipe(gulp.dest, './dist')
    .pipe(opt.ngAnnotate ? g.ngAnnotate : noop)
    .pipe(opt.ngAnnotate ? g.rename : noop, name + '.annotated.' + ext)
    .pipe(opt.ngAnnotate ? gulp.dest : noop, './dist')
    .pipe(ext === 'js' ? g.uglify : g.minifyCss)
    .pipe(g.rename, name + '.min.' + ext)
    .pipe(gulp.dest, './dist')();
}

/**
 * Livereload (or noop if not run by watch)
 */

function livereload() {
  return lazypipe()
    .pipe(isWatching ? g.livereload : noop)();
}

/**
 * Jshint with stylish reporter
 */

function jshint(jshintfile) {
  var jshintSettings = JSON.parse(fs.readFileSync(jshintfile, 'utf8'));

  return lazypipe()
    .pipe(g.jshint, jshintSettings)
    .pipe(g.jshint.reporter, stylish)();
}
