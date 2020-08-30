'use strict';

const colors = {
    Reset     : '\x1b[0m',
    Bright    : '\x1b[1m',
    Dim       : '\x1b[2m',
    Underscore: '\x1b[4m',
    Blink     : '\x1b[5m',
    Reverse   : '\x1b[7m',
    Hidden    : '\x1b[8m',

    FgBlack   : '\x1b[30m',
    FgRed     : '\x1b[31m',
    FgGreen   : '\x1b[32m',
    FgYellow  : '\x1b[33m',
    FgBlue    : '\x1b[34m',
    FgMagenta : '\x1b[35m',
    FgCyan    : '\x1b[36m',
    FgWhite   : '\x1b[37m',

    BgBlack   : '\x1b[40m',
    BgRed     : '\x1b[41m',
    BgGreen   : '\x1b[42m',
    BgYellow  : '\x1b[43m',
    BgBlue    : '\x1b[44m',
    BgMagenta : '\x1b[45m',
    BgCyan    : '\x1b[46m',
    BgWhite   : '\x1b[47m',
}

/**
 * @typedef { object } TestStats
 *
 * @property { number } level
 * @property { number } index
 * @property { number } passed
 * @property { number } failed
 */

/** @type { TestStats } */
let stats = getNewStats();

/**
 * Gets initial TestStats
 *
 * @return { TestStats }
 */
function getNewStats() {
    return {
        level  : 0,
        index  : 0,
        passed : 0,
        failed : 0,
    }
}

/**
 * Runs a group of tests
 *
 * @param { string    } message - description of the test group
 * @param { function  } content - contains a `describe` or `it` functions
 */
function describe(message, content) {
    if (stats.level === 0) {
        stats = getNewStats();
        console.log();
        console.log(colors.Bright + message + colors.Reset);
    }
    else {
        log(colors.Dim + message + colors.Reset);
    }

    stats.level++;

    content();

    stats.level--;

    if (stats.level === 0) {
        showStats();
        const failed = stats.failed;
        stats = getNewStats();

        if (failed) {
            throw new Error("Tests failed: " + failed);
        }
    }
}

/**
 * Runs an assertion function
 *
 * @param { string   } message   - test description
 * @param { function } assertion - contains an assertion
 */
function it(message, assertion) {
    if (stats.level === 0) {
        throw new Error('Error: "it" called out of "describe"');
    }

    stats.index++;

    try {
        assertion();

        logSuccess(testIndex(stats.index) + ". ✅ " + message);
        stats.passed++;
    } catch (e) {
        logError(testIndex(stats.index) + ". ❌ " + message);
        logError(e.message);
        logError("Actual: " + e.actual + ", Expected: " + e.expected);
        stats.failed++;
    }
}

/**
 *  Gets a test index number aligned to the right
 *
 * @param { number } index
 *
 * @return { string }
 */
function testIndex(index) {
    return index > 9
        ? ''  + index
        : ' ' + index;
}

/**
 * Shows a test summary. It resets the stats.
 */
function showStats() {
    const passedText = stats.passed === stats.index
        ? colors.FgGreen + 'Passed: ' + stats.passed + ' of ' + stats.index + colors.Reset
        : 'Passed: ' + stats.passed + ' of ' + stats.index;

    const failedText = stats.failed
        ? colors.FgRed + 'Failed: ' + stats.failed + colors.Reset
        : 'Failed: ' + stats.failed;

    console.log(passedText + ', ' + failedText);
}

/**
 * Logs a message to the console with a proper indentation
 *
 * @param { string } message
 */
function log(message) {
    console.log(indentation() + message);
}

/**
 * Logs a successful test
 *
 * @param { string } message - success message
 */
function logSuccess(message) {
    console.log(indentation() + colors.FgGreen + message + colors.Reset);
}

/**
 * Logs a failed test
 *
 * @param { string } message - error message
 */
function logError(message) {
    console.log(indentation() + colors.FgRed + message + colors.Reset);
}

/**
 * Gets an indentation depending on the "describe" level
 *
 * @return { string }
 */
function indentation() {
    return stats.level
        ? ' '.repeat(4 * stats.level)
        : '';
}

module.exports = {
    describe,
    it,
}
