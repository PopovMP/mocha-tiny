#!/usr/bin/env node

const fs   = require('fs')
const path = require('path')

const testDir = path.join(process.cwd(), 'test')

fs.stat(testDir, (err, stats) => {
	if (err) {
		console.error(err.message)
		return
	}

	if (!stats.isDirectory()) {
		console.error('Cannot find test directory at: ' + testDir)
		return
	}

	fs.readdir(testDir, (err, files) => {
			if (err) {
				console.error(err.message)
				return
			}

			runTests(testDir, files)

			readSubFolders(files)
		}
	)
})

function readSubFolders(files)
{
	for (const file of files) {
		const filepath = path.join(testDir, file)

		fs.stat(filepath, (err, stats) => {
			if (err) {
				console.error(err.message)
				return
			}

			if (stats.isDirectory()) {
				fs.readdir(filepath, (err, files) => {
					if (err) {
						console.error(err.message)
						return
					}

					runTests(filepath, files)
				})
			}
		})
	}
}

/**
 * Requires all test files one by one
 *
 * @param {string  } baseDir
 * @param {string[]} files
 */
function runTests(baseDir, files)
{
	files
		.filter(file => file.match(/\.test\.js$/))
		.forEach((file, index) => {
		console.log(`\n${index + 1}) Run test file: ${file}`)
		require( path.join(baseDir, file) )
	})
}

