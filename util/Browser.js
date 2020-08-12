'use strict';
/**
 * utility class to handle the browser needed in testing
 */

import Config             from '../config';
import Puppeteer          from 'puppeteer';

class Browser {

  /**
   * startup server and initialize environment
   */
  async init(){

    // puppeteer options
    const browserOptions = {
      // https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#setting-up-chrome-linux-sandbox
      args: [               // allow to run as root under linux
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
    };

    // turn headless mode off?
    if( !Config.browser.headless ){
      browserOptions.headless = false;    // show the browser window
      browserOptions.slowMo =   100;      // delay actions, so we recognise something
    }

    // init browser
    this._browser = await Puppeteer.launch( browserOptions );

    // we want to work in incognito mode to prevent caching of any sort
    // can not rely on puppeteer opining directly in incognito mode: https://github.com/GoogleChrome/puppeteer/issues/4400
    this._context = await this._browser.createIncognitoBrowserContext();

  }


  /**
   * close the browser instance and clean up
   */
  async teardown(){
    if( Config.browser.headless && this._browser && this._browser.isConnected() ){
      await this._browser.close();
      this._browser = null;
    }
  }


  /**
   * open a tab with our page loaded
   */
  async openTab(secondURL = false){

    // open the tab
    const tab = await this._context.newPage();
    await tab.setViewport({
      width:  Config.browser.width,
      height: Config.browser.width,
      deviceScaleFactor: 1,
    });

    // forward console output, if requested
    if (Config.browser.logConsole) {
      tab.on('console', async (msg) => {

        // collect all parts and serialize to string
        const out = [],
              parts = msg.args();
        for(let i = 0; i < parts.length; ++i) {
          out.push( await parts[i].jsonValue() );
        }

        // eslint-disable-next-line no-console
        console.log( Config.browser.consolePrefix, out.join( ' ' ) );

      });
    }

    // set default timeout
    tab.setDefaultTimeout( Config.timeout );
    tab.ACTION_TIMEOUT = Config.timeout;


    if (secondURL == false){
    // load page from URL
      await tab.goto( Config.browser.baseURL );
    }
    else{
      await tab.goto( Config.browser2.baseURL );
    }


    // relay access to the tests
    return tab;

  }


  /**
   * close all open tabs
   */
  async closeTabs() {
    return Promise.all(
      (await this._context.pages())
        .map( (tab) => tab.close() )
    );
  }

}


// export singleton
export default new Browser();
