/**
 * General Setup for Testing
 */
export default {

  /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX BROWSER SETTINGS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

  browser: {

    // URL to open at start
    baseURL: 'http://bx2test.inf-bb.uni-jena.de:2002/',

    // hide the browser window? showing the window requires a full window environment
    headless: true,

    // browser dimensions
    width: 1280,
    height: 1024,

    // log the browser console to the test console?
    logConsole: false,

    // prefix for browser console output in the test console
    consolePrefix: '>',

  },

  /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX GENERAL SETTINGS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

  // default timeout for all actions (in ms)
  // Note: test timeout is set separately in .mocharc.js
  timeout: 20 * 1000,

};
