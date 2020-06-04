/**
 * General Setup for Testing
 */
export default {

  /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX BROWSER SETTINGS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

  browser: {

    // URL to open at start
    baseURL: 'http://some.url/',

    // default user
    userNormal: {
      userName: 'USERNAME',
      password: 'PASSWORD',
    },

    // admin user
    userAdmin: {
      userName: 'USERNAME',
      password: 'PASSWORD',
    },

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

  // default timeout for all actions (in ms); "how long can a page.something() call last at most?"
  // Note: test timeout is set separately in .mocharc.js
  timeout: 100 * 1000,

};
