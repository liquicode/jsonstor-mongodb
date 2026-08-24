'use strict';

module.exports = {

	Context:{
		Package: require( '../package.json' ),
		AWS_ProfileName: 'admin',
		AWS_BucketName: '',
	},

	run_tests: [

		// Run the shared conformance inventory against this adapter.
		//
		// A gate, not a report. tests.md is written by jsonstor-docs/build/run-all-tests.js,
		// which runs this same command through the workspace and gathers every member's
		// result into one place. Writing it here too would give the file two authors.
		{
			$Shell: {
				command: 'npx mocha -u bdd test/*.js --timeout 0 --slow 10',
				out: { console: true },
				err: { console: true },
			}
		},

	],

	// build_docs lives in jsonstor-docs now.
	//
	// It was defined here and referred to docs/templates/readme.md in a repository which has
	// no docs/ folder, so it could never have run - which is why every caller below had it
	// commented out. This repository's readme.md is generated from the adapter inventory at
	// jsonstor-docs/docs/data/adapters.js. Edit it there.

	run_webpack: [

		// Run webpack.
		{
			$Shell: {
				command: 'npx webpack-cli --config build/webpack.config.js',
				out: { console: true },
				err: { console: true },
				halt_on_error: false
			}
		},

	],

	update_aws_docs: [

		// Update aws s3 bucket with package docs.
		{
			$Shell: {
				command: 'set "AWS_PROFILE=${AWS_ProfileName}" & aws s3 sync docs s3://${AWS_BucketName}',
				out: { console: true },
				err: { console: true },
			},
		},

	],

	npm_publish_version: [

		// Update npmjs.com with new package.
		{
			$Shell: {
				command: 'npm publish . --access public',
				// output: 'console', errors: 'console', halt_on_error: false
				out: { console: true },
				err: { console: true },
				halt_on_error: false
			}
		},

	],

	git_publish_version: [

		// Update github and finalize the version.
		{
			$Shell: {
				command: 'git add .',
				out: { console: true },
				err: { console: true },
				halt_on_error: false
			}
		},
		{
			$Shell: {
				command: 'git commit --quiet -m "Finalization for v${Package.version}"',
				out: { console: true },
				err: { console: true },
				halt_on_error: false
			}
		},
		{
			$Shell: {
				command: 'git push --quiet origin main',
				out: { console: true },
				err: { console: true },
				halt_on_error: false
			}
		},
		// Tag the existing version
		{
			$Shell: {
				command: 'git tag -a v${Package.version} -m "Version v${Package.version}"',
				out: { console: true },
				err: { console: true },
				halt_on_error: false
			}
		},
		{
			$Shell: {
				command: 'git push --quiet origin v${Package.version}',
				out: { console: true },
				err: { console: true },
				halt_on_error: false
			}
		},

	],

	publish_version: [

		// Finalize and publish the existing version.
		{ $RunTask: { task: 'run_tests' } },
		// { $RunTask: { task: 'build_docs' } },
		// { $RunTask: { task: 'update_aws_docs' } },
		{ $RunTask: { task: 'git_publish_version' } },
		{ $RunTask: { task: 'npm_publish_version' } },

	],

	start_new_version: [

		// Increment and update the official package version.
		{ $SemverInc: { context: 'Package.version' } },
		{
			$PrintContext: {
				context: 'Package',
				out: { as: 'json-friendly', filename: 'package.json' },
			}
		},

		// Reload the package file.
		{
			$ReadJsonFile: {
				filename: 'package.json',
				out: { context: 'Package' },
			}
		},

		// Rebuild the docs.
		// { $RunTask: { task: 'build_docs' } },

		// Update github with the new version.
		{
			$Shell: {
				command: 'git add .',
				out: { console: true },
				err: { console: true },
				halt_on_error: false
			}
		},
		{
			$Shell: {
				command: 'git commit --quiet -m "Initialization for v${Package.version}"',
				out: { console: true },
				err: { console: true },
				halt_on_error: false
			}
		},
		{
			$Shell: {
				command: 'git push --quiet origin main',
				out: { console: true },
				err: { console: true },
				halt_on_error: false
			}
		},

	],

};
