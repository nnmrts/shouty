/* eslint-env node */

const gulp = require("gulp");

const path = require("path");
const fs = require("fs");

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
const nodeCleanup = require("node-cleanup");
const gutil = require("gulp-util");
const liveServer = require("live-server");
const yargs = require("yargs");
const git = require("gulp-git");
const semver = require("semver");
const _ = require("lodash");
const jeditor = require("gulp-json-editor");
const GitHub = require("github-api");
const childProcess = require("child_process");


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

gulp.task("rollup:main", async() => {
	const bundle = await rollup.rollup({
		input: `${paths.src}/scripts/shouty.js`,
		plugins: [
			json({
				preferConst: true
			})
		]
	});

	await bundle.write({
		file: pkg.main,
		format: "cjs",
		name: _.camelCase(pkg.name)
	});
});

gulp.task("babel", () => gulp.src(`${paths.src}/scripts/shouty.js`)
	.pipe(babel({
		compact: false,
		presets: [
			[
				"env",
				{
					targets: {
						node: "0.12.18"
					}
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
		.pipe(gulp.dest(pkg.browser.replace("/shouty.js", ""))));

gulp.task("server.js", () => gulp.src(`${paths.src}/server.js`).pipe(gulp.dest(paths.dist)));

gulp.task("build:js", gulp.series(gulp.parallel("rollup:main", "server.js")));
gulp.task("dev:build:js", gulp.parallel(gulp.series("rollup:browser", "babel"), "rollup:main"));

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

gulp.task("beautify:html", () => gulp.src("./index.html")
	.pipe(htmlbeautify())
	.pipe(gulp.dest(paths.dist)));

gulp.task("build:html", gulp.series("beautify:html"));

gulp.task("dev:build:html", gulp.series("build:html"));

gulp.task("build:misc", () => gulp.src(`${paths.src}/{images/**/*,favicon.ico,robots.txt}`).pipe(gulp.dest(paths.dist)));

gulp.task("dev:build:misc", gulp.series("build:misc"));

gulp.task("build", gulp.series("prepare",
	gulp.parallel(
		"build:js", "build:html", "build:css", "build:misc"
	), "clean:tmp"));

gulp.task("dev:build", gulp.series("prepare", gulp.parallel(
	"dev:build:js", "dev:build:html", "dev:build:css", "dev:build:misc"
), "clean:tmp"));

gulp.task("watch", () => {
	gulp.watch(`${paths.src}/**/*.js`, gulp.series("dev:build:js")).on("change", (srcPath) => {
		gutil.log(`SRC: JS FILE CHANGED: ${srcPath}`);
	});

	gulp.watch(`${paths.src}/**/*.scss`, gulp.series("dev:build:css")).on("change", (srcPath) => {
		gutil.log(`SRC: SCSS FILE CHANGED: ${srcPath}`);
	});

	gulp.watch("index.html", gulp.series("dev:build:html")).on("change", (srcPath) => {
		gutil.log(`SRC: HTML FILE CHANGED: ${srcPath}`);
	});

	gulp.watch(`${paths.src}/{images/**/*,favicon.ico,robots.txt}`, gulp.series("dev:build:misc")).on("change", (srcPath) => {
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

gulp.task("dev", gulp.series("dev:build", gulp.parallel("watch", "server")));

gulp.task("default", gulp.series("build", "commit:build"));

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

const branch = yargs.argv.branch || "master";

const rootDir = `${path.resolve(yargs.argv.rootDir || "./")}/`;

/**
 * @returns {string} current version
 */
const currVersion = () => JSON.parse(fs.readFileSync(`${rootDir}package.json`)).version;

/**
 * @returns {(string|undefined)} release type
 */
const preid = () => {
	if (yargs.argv.alpha) {
		return "alpha";
	}
	if (yargs.argv.beta) {
		return "beta";
	}
	if (yargs.argv.RC) {
		return "RC";
	}
	if (yargs.argv["pre-release"]) {
		return yargs.argv["pre-release"];
	}
	return undefined;
};

/**
 * @returns {string} release type
 */
const versioning = () => {
	if (preid()) {
		return "prerelease";
	}
	if (yargs.argv.minor) {
		return "minor";
	}
	if (yargs.argv.major) {
		return "major";
	}
	return "patch";
};

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

gulp.task("bump", (cb) => {
	const newVersion = semver.inc(currVersion(), versioning(), preid());

	git.pull("origin", branch, {
		args: "--rebase",
		cwd: rootDir
	});

	const versionsToBump = _.map([
		"package.json",
		"bower.json"
	], fileName => rootDir + fileName);

	const commitMessage = `Build: Bumps version to v${newVersion}`;

	gulp.src(versionsToBump, {
		cwd: rootDir
	})
		.pipe(jeditor({
			version: newVersion
		}))
		.pipe(gulp.dest("./", {
			cwd: rootDir
		}))
		.pipe(git.commit(commitMessage, {
			cwd: rootDir
		}))
		.on("end", () => {
			git.push(
				"origin", branch, {

					cwd: rootDir
				}, (err) => {
					if (err) {
						return cb(err);
					}

					return cb();
				}
			);
		});
});

gulp.task("tag", (cb) => {
	const tag = `v${currVersion()}`;

	const message = tag;

	git.tag(
		tag, message, {
			signed: "true",
			cwd: rootDir
		}, (err) => {
			if (err) {
				return cb(err);
			}
			return cb();
		}
	);
});

gulp.task("push", (cb) => {
	git.push(
		"origin", branch, {
			args: "--tags",
			cwd: rootDir
		}, cb
	);
});

gulp.task("npm-publish", done => childProcess.spawn("npm", [
	"publish"
], {
	stdio: "inherit"
}).on("close", done));

gulp.task("github", (cb) => {
	const GitHubAuth = JSON.parse(fs.readFileSync(`${rootDir}.githubauth`));

	const gh = new GitHub(GitHubAuth);

	const repo = gh.getRepo("nnmrts", "shouty");

	repo.listTags().then(() => {
		const tagName = `v${currVersion()}`;

		const targetCommitish = branch;

		const name = tagName;

		const body = "browser: [shouty.js](https://raw.githubusercontent.com/nnmrts/shouty/%t/dist/browser/shouty.js)\nnpm: [shouty.js](https://raw.githubusercontent.com/nnmrts/shouty/%t/dist/shouty.js)\nes module: [shouty.js](https://raw.githubusercontent.com/nnmrts/shouty/%t/dist/module/shouty.js)".replace(/%t/g, tagName);

		const prerelease = versioning() === "prerelease";

		return repo.createRelease({
			tag_name: tagName,
			target_commitish: targetCommitish,
			name,
			body,
			draft: false,
			prerelease
		}).then(() => {}).catch((e) => {
			gutil.log(e);

			cb(e);
		});
	}).catch((e) => {
		cb(e);
	});
});

gulp.task("release", gulp.series(
	"build", "commit:build", "bump", "tag", "push", "npm-publish"
));

let cleanSignal;

gulp.task("kill-process", () =>
	process.kill(process.pid, cleanSignal));

nodeCleanup((exitCode, signal) => {
	if (signal) {
		cleanSignal = signal;

		// server.stop();

		gulp.series("clean:tmp", "kill-process");

		nodeCleanup.uninstall(); // don't call cleanup handler again
		return false;
	}
	return undefined;
}, {
	ctrl_C: "{^C}",
	uncaughtException: "Uh oh. Look what happened:"
});
