# Mocha-tiny - straightforward unit testing: `describe` and `it`

**mocha-tiny** is a very simple, zero dependencies helper for unit tests.

Homepage: https://github.com/popovmp/mocha-tiny

## Synopsis

```javascript
const { strictEqual  } = require('assert');
const { describe, it } = require('@popovmp/mocha-tiny');

function sum(m, n) {
    return m + n;
}

describe('Test math', () => {
    describe('sum', () => {
        it('is a function', () => {
           strictEqual(typeof sum, 'function');
        });

        it('accepts two args', () => {
            strictEqual(sum.length, 2);
        });

        it('sums numbers', () => {
            const actual   = sum(2, 3);
            const expected = 5;
            strictEqual(actual, expected);
        });
    });
});
```

Output:

```text
Test math
    sum
        1. ✅ is a function
        2. ✅ accepts two args
        3. ✅ sums numbers
Passed: 3 of 3, Failed: 0
```

On a failed test:

```text
        3. ❌ sums numbers
        Expected values to be strictly equal:

5 !== 6

        Actual: 5, Expected: 6
Passed: 2 of 3, Failed: 1
```

## Installation

```
npm install @popovmp/mocha-tiny
```

## Usage

**mocha-tiny** runs a test functions, collects stats, and prints a summary.

Usually you have one or two levels of nested `describe` function, which contains a number of `it` functions.
The actual tests are in the second argument of `it`.

```javascript
describe('system under test', () => {
    describe('method under test', () => {
        it('behavior', () => {
            const actual   = getFoo();
            const expected = 'foo';
            assert.strictEqual(actual, expected);
        });
    });
});
```

The helper runs the `describe` and the `it` functions sequentially.
It means, you can initialize your tests at the begging of a `describe` block and to clean up at the end.

```javascript
describe('Test group', () => {
    // Init the test environment.
    const systemUnderTest = {
        theAnswer: 42,
    };

    it('test...', () => {
       strictEqual(systemUnderTest.theAnswer, 42);
    });

    // Clean
    systemUnderTest.theAnswer = 0;
});
```

**mocha-tiny** throws an error if there are failed tests.

## Run all tests

**mocha-tiny** exports a `mocha-tiny` command. It finds and runs all tests in the `./test` folder.

The accepted test files format is `test-name.test.js`.

You can set this command in your `package.js`:

```json
{
  "scripts": {
    "test": "mocha-tiny"
  }
}
```

## Methods

**mocha-tiny** exports two methods:

```javascript
/**
 * Runs a group of tests
 *
 * @type { function } Describe
 *
 * @param { string   } message - description of the test group
 * @param { function } func    - contains a `describe` or `it` functions
 */
function describe(message, func) { }
```

```javascript
/**
 * Runs a function with assert
 *
 * @param { string   } message - test description
 * @param { function } test    - test function
 */
function it(message, test) { }
```

## License

`mocha-tiny` is free for use and modification. No responsibilities for damages of any kind.

Copyright (c) 2020 Miroslav Popov
