var gulp = require('gulp'), // Подключаем gulp
    less = require('gulp-less'), // Подключаем gulp-less
    browserSync = require('browser-sync'), // Подключаем Browser Sync
    concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    autoprefixer = require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления префиксов
    cssnano = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    include = require("gulp-include"); // Подключаем gulp-include (для подгрузки htlm блоков)
    // imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    // pngquant = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    // del = require('del');

// Таск "browser-sync"
gulp.task('browser-sync', function () {
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

// Таск "LESS"
gulp.task('less', function () {
    return gulp.src('app/less/main.less') // Источник
        .pipe(less())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true})) // Префиксы
        .pipe(cssnano())
        .pipe(gulp.dest('app/css')) // Результат в папку app/css
        .pipe(gulp.dest('../frontend/web/css/')) // Результат в папку app/css
        .pipe(browserSync.reload({stream: true})); // Обновляем CSS на странице при изменении
});

// Таск libcss - збирає всі css-файли плагінів в один файл
gulp.task('libcss', function () {
    return gulp.src('app/less/base/libsCss.less') // Источник
        .pipe(less())
        .pipe(cssnano())
        .pipe(gulp.dest('app/css')) // Результат в папку app/css
});

// Таск "include"
gulp.task('include', function () {
    return gulp.src("app/page/**/*.html") // Источники
        .pipe(include())
        .pipe(gulp.dest("app"));
    // .pipe(browserSync.reload({stream: true}));
});

// Таск "scripts"
gulp.task('scripts', function () {
    return gulp.src([ // Берем все необходимые библиотеки
        'app/libs/jquery/dist/jquery.min.js', // jQuery
        // 'app/libs/bootstrap/dist/js/bootstrap.min.js', // Bootsrap
        // 'app/libs/slick-carousel/slick/slick.min.js', //SlickSlider
        // 'app/libs/owl.carousel/dist/owl.carousel.min.js', //OwlCarousel
        // 'app/libs/fancybox/dist/jquery.fancybox.min.js', //FancyBox 3.2
        // 'app/libs/fancybox-2.1.7/source/jquery.fancybox.js', //FancyBox
        // 'app/libs/jquery-mousewheel/jquery.mousewheel.min.js',
        // 'app/libs/wow/dist/wow.min.js', // Wow.js
        'app/libs/jquery-ui/jquery-ui.min.js', // Price
        'app/libs/jqueryui-touch-punch/jquery.ui.touch-punch.min.js', // Touch-Punch for price
        // 'app/libs/jquery-touchswipe/jquery.touchSwipe.min.js', // TouchSwipe for product slider
    ])
        .pipe(concat('libs.min.js')) // Собираем их в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});


gulp.task('clean', function () {
    return del(['../frontend/web/img/**', '!../frontend/web/img'], {force: true});
});
// ['clean']
gulp.task('img', ['clean'], function () {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(imagemin({ // Сжимаем их с наилучшими настройками
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('../frontend/web/img')); // Выгружаем на продакшен
});

// Таск "watch"
gulp.task('watch', ['less', 'include'], function () {
    gulp.watch('app/less/**/*.less', ['less']); // Наблюдение за less файлами
    gulp.watch('app/components/**/*.html', ['include', browserSync.reload]); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/page/**/*.html', ['include', browserSync.reload]); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js
});

gulp.task('default', ['watch', 'browser-sync']);