/* eslint-env node */

const gulp = require("gulp");

const taskTime = require("gulp-total-task-time");
const del = require("del");
const eslint = require("gulp-eslint");
const rollup = require("rollup");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const json = require("rollup-plugin-json");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const vinylPaths = require("vinyl-paths");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const htmlbeautify = require("gulp-html-beautify");
const gutil = require("gulp-util");
const liveServer = require("live-server");
const git = require("gulp-git");
const _ = require("lodash");
const builtins = require("rollup-plugin-node-builtins");
const globals = require("rollup-plugin-node-globals");

const pkg = require("./package.json");

taskTime.init();

const paths = {
	dist: "./dist",
	src: "./src",
	tmp: "./.tmp"
};

gulp.task("clean:dist", () =>
	del(`${paths.dist}/**`));

gulp.task("clean:tmp", () =>
	del(`${paths.tmp}/**`));

gulp.task("clean", gulp.parallel("clean:tmp"));

gulp.task("lint", () => gulp.src(`${paths.src}/scripts/**/*.js`)
	.pipe(eslint({
		fix: true
	}))
	.pipe(eslint.format())
	.pipe(eslint.failAfterError()));

gulp.task("prepare:js", gulp.series("lint"));

gulp.task("prepare", gulp.series("clean", "prepare:js"));

gulp.task("rollup:browser", async() => {
	const bundle = await rollup.rollup({
		input: `${paths.src}/scripts/shouty.js`,
		plugins: [
			globals(),
			builtins(),
			resolve(),
			commonjs(),
			json({
				preferConst: true
			})
		]
	});

	await bundle.write({
		file: pkg.browser,
		format: "iife",
		name: _.camelCase(pkg.name),
		sourcemap: "inline"
	});
});

gulp.task("babel", () => gulp.src(`${paths.dist}/shouty.js`)
	.pipe(babel({
		compact: false,
		presets: [
			[
				"env",
				{
					targets: {
						browsers: [
							"> 0.01%"
						]
					}
				}
			]
		],
		plugins: [
			[
				"angularjs-annotate",
				{
					explicitOnly: true
				}
			]
		]
	}))
	.pipe(gulp.dest(paths.dist)));

gulp.task("minify:js", () =>
	gulp.src(pkg.browser)
		.pipe(uglify({
			warnings: true
		}))
		.pipe(gulp.dest(paths.dist)));

gulp.task("build:js", gulp.series("rollup:browser", "babel", "minify:js"));
gulp.task("dev:build:js", gulp.series("rollup:browser"));

gulp.task("sass", () => gulp.src(`${paths.src}/main.scss`)
	.pipe(sourcemaps.init({
		largeFile: true
	}))
	.pipe(sass({
		outputStyle: "expanded",
		precision: 10,
		includePaths: [
			"./",
			"node_modules"
		]
	}).on("error", sass.logError))
	.pipe(sourcemaps.mapSources(sourcePath => `../src/${sourcePath}`))

	.pipe(sourcemaps.write(".", {
		charset: "utf-8",
		mapFile(mapFilePath) {
			return mapFilePath.replace("main", "shouty");
		}
	}))
	.pipe(gulp.dest(paths.tmp)));

gulp.task("rename", () => gulp.src(`${paths.tmp}/main.css`)
	.pipe(vinylPaths(del))
	.pipe(rename({
		basename: "shouty"
	}))
	.pipe(gulp.dest(paths.tmp)));

gulp.task("autoprefixer", () => gulp.src(`${paths.tmp}/shouty.css`)
	.pipe(sourcemaps.init({
		largeFile: true,
		loadMaps: true
	}))
	.pipe(autoprefixer({
		browsers: [
			"> 0.1%"
		],
		cascade: false
	}))
	.pipe(sourcemaps.write(".", {
		charset: "utf-8"
	}))
	.pipe(gulp.dest(paths.dist)));

gulp.task("minify:css", () => gulp.src(`${paths.dist}/shouty.css`)
	.pipe(sourcemaps.init({
		largeFile: true,
		loadMaps: true
	}))
	.pipe(cleanCSS({
		compatibility: "ie7",
		level: 2
	}))
	.pipe(sourcemaps.write(".", {
		charset: "utf-8"
	}))

	.pipe(gulp.dest(paths.dist)));

gulp.task("build:css", gulp.series(
	"sass", "rename", "autoprefixer", "minify:css"
));

gulp.task("dev:build:css", gulp.series("sass", "rename", "autoprefixer"));

gulp.task("beautify:html", () => gulp.src(`${paths.src}/**/*.html`)
	.pipe(htmlbeautify())
	.pipe(gulp.dest(paths.dist)));

gulp.task("build:html", gulp.series("beautify:html"));

gulp.task("dev:build:html", gulp.series("build:html"));

gulp.task("build:misc", () => gulp.src(`${paths.src}/{images/**/*,favicon.ico,robots.txt,messages.json}`).pipe(gulp.dest(paths.dist)));

gulp.task("dev:build:misc", gulp.series("build:misc"));

gulp.task("build", gulp.series("prepare",
	gulp.parallel(
		"build:js", "build:html", "build:css", "build:misc"
	), "clean:tmp"));

gulp.task("dev:build", gulp.series("prepare", gulp.parallel(
	"dev:build:js", "dev:build:html", "dev:build:css", "dev:build:misc"
), "clean:tmp"));

gulp.task("watch", () => {
	gulp.watch(`${paths.src}/**/*.js`, {
		interval: 1000
	}, gulp.series("dev:build:js")).on("change", (srcPath) => {
		gutil.log(`SRC: JS FILE CHANGED: ${srcPath}`);
	});

	gulp.watch(`${paths.src}/**/*.scss`, {
		interval: 1000
	}, gulp.series("dev:build:css")).on("change", (srcPath) => {
		gutil.log(`SRC: SCSS FILE CHANGED: ${srcPath}`);
	});

	gulp.watch(`${paths.src}/**/*.html`, {
		interval: 1000
	}, gulp.series("dev:build:html")).on("change", (srcPath) => {
		gutil.log(`SRC: HTML FILE CHANGED: ${srcPath}`);
	});

	gulp.watch(`${paths.src}/{images/**/*,favicon.ico,robots.txt,messages.json}`, {
		interval: 1000
	}, gulp.series("dev:build:misc")).on("change", (srcPath) => {
		gutil.log(`SRC: MISC FILE CHANGED: ${srcPath}`);
	});
});

gulp.task("server", () => {
	liveServer.start({
		port: 9000,
		root: "./dist",
		wait: 1000,
		open: false,
		logLevel: 2
	});
});

gulp.task("dev", gulp.series("dev:build", "watch"));

gulp.task("commit:build", cb =>
	gulp.src("./dist/**/*.*").pipe(git.add()).pipe(git.commit("Build: generated dist files", {
		args: "-s -S",
		cwd: rootDir
	}, (err) => {
		if (err) {
			return cb(err);
		}

		return cb();
	})));


gulp.task("default", gulp.series("build", "commit:build"));
