'use strict'

const colors = {
	Reset  : '\x1b[0m',
	Bright : '\x1b[1m',
	Dim    : '\x1b[2m',
	FgRed  : '\x1b[31m',
	FgGreen: '\x1b[32m',
	FgBlue : '\x1b[34m',
}

/**
 * @typedef { object } TestStats
 *
 * @property { number } level  - the depth of the nested "describe"
 * @property { number } count  - total count of the tests
 * @property { number } passed - count of passed tests
 * @property { number } failed - count of failed tests
 * @property { number } start  - start time
 */

/** @type { TestStats } */
let stats = getNewStats()

/**
 * Gets initial TestStats
 *
 * @return { TestStats }
 */
function getNewStats()
{
	return {
		level : 0,
		count : 0,
		passed: 0,
		failed: 0,
		start : 0,
	}
}

/**
 * Runs a group of tests
 *
 * @param { string   } message - description of the test group
 * @param { function } content - contains a `describe` or `it` functions
 */
function describe(message, content)
{
	if (stats.level === 0) {
		stats = getNewStats()
		console.log()
		console.log(colors.Bright + message + colors.Reset)
		stats.start = Date.now()
	}
	else {
		log(colors.FgBlue + message + colors.Reset)
	}

	stats.level++
	content()
	stats.level--

	if (stats.level > 0)
		return

	logStatsSummary()
	const failed = stats.failed
	stats = getNewStats()

	if (failed)
		throw new Error('Tests failed: ' + failed)
}

/**
 * Runs an assertion function
 *
 * @param { string   } message   - test description
 * @param { function } assertion - contains an assertion
 */
function it(message, assertion)
{
	stats.count++

	try {
		assertion()
		logSuccess(message)
		stats.passed++
	}
	catch (e) {
		logError(message)
		log(`Actual: ${colors.FgRed + e.actual + colors.Reset}, ` +
			`Expected: ${colors.FgGreen + e.expected + colors.Reset}`)
		log(e.stack)
		stats.failed++
	}
}

/**
 * Logs the test summary message
 */
function logStatsSummary()
{
	const passedText = stats.passed === stats.count
		? `${colors.FgGreen}Passed: ${stats.passed} of ${stats.count}${colors.Reset}`
		: `Passed: ${stats.passed} of ${stats.count}`

	const failedText = stats.failed
		? `${colors.FgRed}Failed: ${stats.failed}${colors.Reset}`
		: `Failed: ${stats.failed}`

	const time = Date.now() - stats.start

	console.log(`${passedText}, ${failedText} (${time} ms)`)
}

/**
 * Logs a message to the console with a proper indentation
 *
 * @param { string } message
 */
function log(message)
{
	console.log(indentation() + message)
}

/**
 * Logs a successful test
 *
 * @param { string } message - success message
 */
function logSuccess(message)
{
	console.log(indentation() + colors.FgGreen + 'ok - ' + message + colors.Reset)
}

/**
 * Logs a failed test
 *
 * @param { string } message - error message
 */
function logError(message)
{
	console.log(indentation() + colors.FgRed + 'not ok - ' + message + colors.Reset)
}

/**
 * Gets an indentation depending on the "describe" level
 *
 * @return { string }
 */
function indentation()
{
	return stats.level ? ' '.repeat(4 * stats.level) : ''
}

module.exports = {
	describe,
	it,
}
