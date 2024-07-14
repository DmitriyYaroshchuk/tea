const gulp = require('gulp');
require('./gulp/dev.js');
require('./gulp/docs.js')


//__________  Таск который запускает DEV-сборку  __________//
gulp.task('default', gulp.series(
    'clean:dev',
    gulp.parallel('html:dev', 'sass:dev', 'images:dev', 'fonts:dev', 'reset:dev', 'files:dev', 'js:dev'),
    gulp.parallel('server:dev', 'watch:dev')
));



//__________  Таск который запускает Production-сборку  __________//
gulp.task('docs', gulp.series(
    'clean:docs',
    gulp.parallel('html:docs', 'sass:docs', 'images:docs', 'fonts:docs', 'reset:docs', 'files:docs', 'js:docs'),
    gulp.parallel('server:docs')
));