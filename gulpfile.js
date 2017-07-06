var gulp         = require('gulp'), // Подключаем gulp
	less         = require('gulp-less'), // Подключаем gulp-less
	browserSync  = require('browser-sync'), // Подключаем Browser Sync
	concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
	autoprefixer = require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления префиксов
    cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    include      = require("gulp-include"); // Подключаем gulp-include (для подгрузки htlm блоков)

// Таск "browser-sync"
gulp.task('browser-sync', function() {
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

// Таск "LESS"
gulp.task('less', function(){
    return gulp.src('app/less/main.less') // Источник
    .pipe(less())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Префиксы
        .pipe(cssnano())
        .pipe(gulp.dest('app/css')) // Результат в папку app/css
        .pipe(browserSync.reload({stream: true})); // Обновляем CSS на странице при изменении
    });

// Таск "include"
gulp.task('include', function() {
    return gulp.src("app/page/*.html") // Источники
    .pipe(include())
    .pipe(gulp.dest("app"));
});

// Таск "scripts"
gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'app/libs/jquery/dist/jquery.min.js', // jQuery
        'app/libs/bootstrap/js/bootstrap.min.js', // Bootsrap
        'app/libs/slick-carousel/slick/slick.min.js', //SlickSlider
        'app/libs/owl.carousel/dist/owl.carousel.min.js', //OwlCarousel
        // 'app/libs/jquery-fancyBox/dist/jquery.fancybox.min.js', //FancyBox
        'app/libs/fancybox-2.1.7/source/jquery.fancybox.js', //FancyBox
        'app/libs/jquery-mousewheel/jquery.mousewheel.min.js',
        'app/libs/jquery-mixitup/dist/mixitup.min.js', //MixitUp
        'app/libs/vivus/dist/vivus.min.js', // SVG drowin
        'app/libs/wow/dist/wow.min.js', // Wow.js
        'app/libs/jquery-ui/jquery-ui.min.js',
        'app/libs/jqueryui-touch-punch/jquery.ui.touch-punch.min.js',
        'app/libs/jquery-touchswipe/jquery.touchSwipe.min.js',
        'app/libs/waypoints/lib/jquery.waypoints.min.js'
        ])
        .pipe(concat('libs.min.js')) // Собираем их в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')) // Выгружаем в папку app/js
        .pipe(browserSync.reload({stream: true}));
    });

// Таск "watch"
gulp.task('watch', ['less', 'scripts', 'include'], function() {
    gulp.watch('app/less/**/*.less', ['less']); // Наблюдение за less файлами
    gulp.watch('app/page/*.html', ['include']); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/*.js', ['scripts']); // Наблюдение за JS файлами в папке js
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
});

gulp.task('default', ['browser-sync', 'watch']);