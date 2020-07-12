import Browser    from '../../util/Browser';
import util       from '../../util/common';
import { assert } from 'chai';
import login from '../../util/common/login';

describe( 'LUI calculation', () => {

  it( 'should show an error when selected parameter do not return an result', async () => {

    // open a new tab
    const page = await Browser.openTab();

    // ensure a normal user is logged in
    await login.loginUser (page);

    // navigate to "Create dataset"
    await assert.isFulfilled( util.menu.select( page, 'LUI Calculation' ), 'should open the LUI tool' );

    await assert.isFulfilled( page.waitForSelector( '#divQuery0', { visible: true }), 'wait for LUI page' );

    await assert.isFulfilled( page.click( 'input[value="NewSet"]' ), 'should select new dataset as base input' );

    await assert.isFulfilled( page.click( 'input[value="unstandardized"]' ), 'should select raw data (unstandardized)' );

    await assert.isFulfilled( page.waitForSelector( '.t-status-text', { visible: true }), 'wait for table' );

    const itemNumberString = await page.$eval( '.t-status-text', (el) => el.textContent );
    const itemNumber = itemNumberString.split(' ');
    assert.isAbove( parseInt(itemNumber[6]), 1949,  `table should show 1950 or more items. Found: ${parseInt(itemNumber[6])}` );
  });


  it( 'should show an error (timeout) when selected parameter do not return an result old set', async () => {

    // open a new tab
    const page = await Browser.openTab();

    // ensure a normal user is logged in
    //await login.loginUser (page);

    await assert.isFulfilled( util.menu.select( page, 'LUI Calculation' ), 'should open the LUI tool' );

    await assert.isFulfilled( page.waitForSelector( '#divQuery0', { visible: true }), 'wait for LUI page' );

    await assert.isFulfilled( page.click( 'input[value="OldSet"]' ), 'should select old dataset as base input' );

    await assert.isFulfilled( page.click( 'input[value="unstandardized"]' ), 'should select raw data (unstandardized)' );

    await assert.isFulfilled( page.waitForSelector( '.status-text', { visible: true }), 'wait for table' );

    // add check for real data once it is working again
  });



});
