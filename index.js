'use strict';

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
 * @type { function } Describe
 *
 * @param { string    } message - description of the test group
 * @param { function  } func - contains a `describe` or `it` functions
 */
function describe(message, func) {
    if (stats.level === 0) {
        console.log();
    }

    log(message);

    stats.level++;

    func();

    stats.level--;

    if (stats.level === 0) {
        showStats();
    }
}

/**
 * Runs a function with assert
 *
 * @type { function } It
 *
 * @param { string   } message - test description
 * @param { function } test - test function
 */
function it(message, test) {
    stats.index++;

    if (stats.level === 0) {
        throw new Error('Error: "it" called out of "describe"');
    }

    try {
        test();

        log(stats.index + ". ✅ " + message);
        stats.passed++;
    } catch (e) {
        error(stats.index + ". ❌ " + message);
        error(e.message);
        error("Actual: " + e.actual + ", Expected: " + e.expected);
        stats.failed++;
    }
}

/**
 * Shows a test summary. It resets the stats.
 */
function showStats() {
    const message = `Passed: ${stats.passed} of ${stats.index}, Failed: ${stats.failed}`;
    const failed = stats.failed;

    stats = getNewStats();

    if (failed) {
        error(message);
    } else {
        log(message);
    }

    if (failed) {
        throw new Error("Tests failed: " + failed);
    }
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
 * Logs an error message to the console with a proper indentation
 *
 * @param { string } message - error message
 */
function error(message) {
    console.error(indentation() + message);
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
