# BExIS Integration Tests

This repository provides a test environment to perform integration tests on a running [BExIS2 instance](https://github.com/BEXIS2) - local or remote.

* [Installation and running](#installation-and-running)
* [Writing a test(suite)](#writing-a-testsuite)
  * [Hints](#hints)
* [Control which tests are run](#control-which-tests-are-run)
  * [by filename](#by-file-name)
  * [by testsuite or test](#by-testsuite-or-test)
    * [Skipping testsuites or tests](#skipping-testsuites-or-tests)
* [Utilities](#utilities)

## Installation and running

The scripts expect a local [NodeJS](https://nodejs.org/) installation.

After cloning the repository run the following command from its root folder to install all dependencies:
```bash
npm install
```

Adjust `config.js` to your setup.
In particular, you might want to change `browser.baseURL` to point to the instance to run the tests upon.

To run the actual tests, execute the following command again from the root folder of the repository:
```bash
npm run test
```

In a CI/CD environment you might want to run a `test:ci` instead.
This will run all enabled tests and collect the result in a file `test-report.xml` in the root folder.
This file uses the JUnit XML format, which is recognized by most CI/CD environments.

## Writing a test(suite)

This repository relies on [Mocha](https://mochajs.org/) as a test runner and [Chai](https://www.chaijs.com/) for assertions.
For a list of possible assertions, please refer to the [Chai documentation](https://www.chaijs.com/api/assert/).

As we are running all test within a (headless) browser, all actions are asynchronous.
This means you will get a `Promise` as the result of function calls and have to wait until they are resolved (see [MDN on `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)).
Many test will check, whether a specific element is shown or a specific action can be executed.
For these cases the plugin [Chai as promised](https://www.chaijs.com/plugins/chai-as-promised/) is included that provides among others also the following two new assertions:
* `assert.isFulfilled()` ... checks whether the given async operation is resolved successfully
* `assert.isRejected()` ... checks whether the given async operation is rejected with the proper error

Both of these assertions are asynchronous themselves, so you will need to call them using `await`.

Using these tools a template for a testsuite can look like this:

```javascript
import Browser    from '../util/Browser';
import util       from '../util/common';
import { assert } from 'chai';

describe( 'Registration', () => {

  it( 'should do something', async () => {

    // get a tab
    const page = await Browser.openTab();

    // perform the workflow
    await assert.isFulfilled( util.do.something( page ), 'should do something' );

    // validate the result
    const content = await page.$eval( '.some_element', (el) => el.textContent );
    assert.equal( content, 'expected content', 'should show the correct content' );

  });

  it( 'should also do something else', async () => { /* ... */ } );

});
```

Note that all actions themselves are wrapped in a `assert.isFulfilled()`.
This pattern allows for easier debugging, as the test report will show which exact step failed with the respective error message.

## Hints

* Using `page` you have full access to the page itself. A documentation of the available functions can be found [here](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md).

* If you call a function of `page` that uses a callback, consider that this callback runs in a different context, so it does not have access to the local test variables. To transfer variables back and forth, use serializable variables and the respective way of passing parameters to the callbacks. The same extents to accessing libraries (e.g., jQuery in the browser context) and other code fragments.

* When you action trigger some asynchronous operation like an AJAX request or an animation, use a `waitFor()` next to suspend the text execution until the async operation has finished. This may wait for events like an element to (dis)appear or an navigation to finish. 

* If possible at all, don't use `waitFor()` with times (integers). This is bound to fail when the execution is delayed due to network issues or any other effect. Preferably wait for elements to appear.

* Common operations should be moved to [utilities](#utilities), so they can be reused in other tests. Examples include selecting a menu entry or the login-logout-procedures.

* If you want to test the same component with different inputs, consider using a generator function, that takes the inputs as parameters and execute the test. That way you remove unnecessary duplicate code.

* Make sure you validate or enforce all your assumptions when starting a test. Possible side effects from previous tests include, e.g., the current login status.

## Control which tests are run

There are several ways to control, which tests are run.

### by file name

Adjust the `spec` parameter in `.mocharc.js` with the [globs](https://github.com/isaacs/node-glob#glob-primer) to match the files you want to run.
Make sure to always include `setup.js`, as this initializes the browser and loads further plugins.
To run all test (including subfolders), use the following:
```javascript
spec: [ 'test/setup.js', 'test/**/*.js' ],
```

### by testsuite or test

You can limit to run only specific test suites by using `only` after the definition of the respective testsuite or test.
So for a testsuite instead of a definition like
```javascript
describe( 'Core - essential function', async () => { /* ... */ } );
```
you would use
```javascript
describe.only( 'Core - essential function', async () => { /* ... */ } );
```
Similarly, the syntax for a single test changes from 
```javascript
it( 'should do something meaningful', async () => { /* ... */ } );
```
you would use
```javascript
it.only( 'should do something meaningful', async () => { /* ... */ } );
```
**Note**:
If at least one test or testsuite is annotated like this, only those tests or testsuites are run that have that annotation.
All others will be skipped.

#### Skipping testsuites or tests

You can also annotate individual tests or testsuites to be skipped.
In this case use `skip` instead of `only` in the same way as highlighted before.

## Utilities

Some click-streams like logging a user in, appear in multiple tests.
In order to reduce the amount of redundant code, the functions in `util/common` are intended to provide such functionalities.

They are subsumed in `util/common.js` to be easily imported into test(suites) while still maintaining a proper structure of files in their definition.

All utility function need access to the open browser page.
So all of them share their first parameter `page`.
