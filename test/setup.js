import Browser        from '../util/Browser';
import Config         from '../config';
import Chai           from 'chai';
import ChaiAsPromised from 'chai-as-promised';

// chai plugins
Chai.use( ChaiAsPromised );

before( async () => {

  // init the browser
  await Browser.init();

});


after( async () => {

  // init the browser
  await Browser.teardown();

});


afterEach( async () =>{

  // close all tabs to save some memory and prevent interactions between tabs
  if( Config.browser.headless ) {
    await Browser.closeTabs();
  }

});
