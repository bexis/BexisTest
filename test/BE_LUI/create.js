import Browser    from '../../util/Browser';
import util       from '../../util/common';
import { assert } from 'chai';
import login from '../../util/common/login';
import elements from '../../util/common/elements';

describe( 'LUI calculation', () => {

  it( 'should show an error when selected parameter do not return an result table for new components set', async () => {

    // open a new tab
    const page = await Browser.openTab();

    // ensure a normal user is logged in
    await login.loginUser (page);

    await showRawData ( page, 'new components set');

    // read total number of item in table and compare with expected
    const itemNumber = await elements.itemNumber_Telerik ( page );
    assert.isAbove(itemNumber , 1949,  `table should show 1950 or more items. Found: ${itemNumber}` );
  });


  it( 'should show an error when selected parameter do not return an result table for old components set', async () => {

    // open a new tab
    const page = await Browser.openTab();

    // ensure a normal user is logged in
    // await login.loginUser (page);

    await showRawData (page, 'old components set');

    // read total number of item in table and compare with expected
    const itemNumber = await elements.itemNumber_Telerik ( page );
    assert.equal(itemNumber , 1650,  `table should show 1650 items. Found: ${itemNumber}` );
  });
});


/**
 * Navigate to LUI tool and select to show raw data
 *
 * @param   {Object}    page      page to work upon
 * @param {String} type dataset type
 */
async function showRawData ( page, type ){

  // open LUI tool
  await assert.isFulfilled( util.menu.select( page, 'LUI Calculation' ), 'should open the LUI tool' );

  // wait until page is loaded
  await assert.isFulfilled( page.waitForSelector( '#divQuery0', { visible: true }), 'wait for LUI page' );

  // select type of input data (old / new)
  await assert.isFulfilled( page.click( 'input[value="' + type + '"]' ), 'should select new dataset as base input' );

  // select unstandardized to show table with raw data
  await assert.isFulfilled( page.click( 'input[value="unstandardized"]' ), 'should select raw data (unstandardized)' );

  // wait until table is loaded
  await assert.isFulfilled( page.waitForSelector( '.t-status-text', { visible: true }), 'wait for telerik table' );

}