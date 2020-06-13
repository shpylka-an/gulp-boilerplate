const gulp = require('gulp')
const browsersync = require('browser-sync')
const fileinclude = require('gulp-file-include')
const del = require('del')
const scss = require('gulp-sass')

let projectFolder = 'dist'
let sourceFolder = 'src'

let path = {
    build: {
        html: `${projectFolder}/`,
        css: `${projectFolder}/css/`,
        js: `${projectFolder}/js/`,
        img: `${projectFolder}/img/`,
    },
    src: {
        html: [`${sourceFolder}/*.html`, `!${sourceFolder}/_*.html`],
        css: `${sourceFolder}/scss/style.scss`,
        js: `${sourceFolder}/js/script.js`,
        img: `${sourceFolder}/img/**/*.{jsg,png,svg,gif,ico,webp}`,
    },
    watch: {
        html: `${sourceFolder}/**/*.html`,
        css: `${sourceFolder}/scss/**/*.scss`,
        js: `${sourceFolder}/js/**/*.js`,
        img: `${sourceFolder}/img/**/*.{jsg,png,svg,gif,ico,webp}`,
    },
    clean: `./${projectFolder}/`
}

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: `./${projectFolder}/`
        },
        port: 3000,
        notify: false,
    })
}

function html() {
    return gulp.src(path.src.html)
    .pipe(fileinclude())
    .pipe(gulp.dest(path.build.html))
    .pipe(browsersync.stream())
}

function css() {
    return gulp.src(path.src.css)
    .pipe(
        scss({
            outputStyle: 'expanded'
        })
    )
    .pipe(gulp.dest(path.build.css))
    .pipe(browsersync.stream())
}

function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
}

function clean(params) {
    return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(css, html))
let watch = gulp.parallel(build, watchFiles, browserSync)

exports.build = build
exports.watch = watch
exports.default = watch
