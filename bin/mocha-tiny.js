#!/usr/bin/env node

const fs   = require('fs')
const path = require('path')

const testDir = path.join(process.cwd(), 'test')

fs.stat(testDir,
	fs_stat_ready)

/**
 * @param { Error } err
 * @param { Stats } stats
 */
function fs_stat_ready(err, stats)
{
	if (err) {
		console.error(err.message)
		return
	}

	if (!stats.isDirectory()) {
		console.error('Cannot find test directory at: ' + testDir)
		return
	}

	fs.readdir(testDir,
		fs_readdir_ready)
}

/**
 * @param { Error    } err
 * @param { string[] } files
 */
function fs_readdir_ready(err, files)
{
	if (err) {
		console.error(err.message)
		return
	}

	// Accepted test files are: testName.test.js
	runTests(files.filter(file => file.match(/\.test\.js$/)))

	// Accepted test files are: testName.test.mjs
	runEcmaModules(files.filter(file => file.match(/\.test\.mjs$/)))
}

/**
 * Requires all test files one by one
 *
 * @param { string[] } files
 */
function runTests(files)
{
	files.forEach((file, index) => {
		console.log(`\n${index + 1}) Run test file: ${file}`)

		require( path.join(testDir, file) )
	})
}

/**
 * Requires all Ecma modules test files one by one
 *
 * @param { string[] } files
 */
function runEcmaModules(files)
{
	files.forEach((file, index) => {
		console.log(`\n${index + 1}) Run test module: ${file}`)

		import( path.join('file:///', testDir, file) )
	})
}
