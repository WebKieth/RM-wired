const gulp = require('gulp'),
cheerio = require('gulp-cheerio'),
svgmin = require('gulp-svgmin'),
replace = require('gulp-replace'),
util = require('gulp-util'),
notify = require('gulp-notify'),
svgSprite = require('gulp-svg-sprite'),
path = require('path');
  let dest = path.join('src', 'assets', 'icons');
  let svgConfig = {
    mode: {
      symbol:{
        sprite: "../sprite.svg"
      }
    }
  };
  gulp.task('sprite', function() {
    gulp.src("**/*.svg", {cwd: path.join(dest, 'exported')})
      .pipe(svgSprite(svgConfig))
      .pipe(cheerio({
        run: function ($) {
          $('[stroke]').attr('stroke', '');
          $('[viewBox]').attr('viewBox', '0 0 18 18');
          return
        },
        parserOptions: {xmlMode: true}
      }))
      .pipe(replace('&gt;', '>'))
      
      .on('error', function(err) {
        util.log(err);
      })
      .on('error', notify.onError('sprite compiling error!'))
      .pipe(gulp.dest(dest))
  });