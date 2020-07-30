import Browser    from '../../../util/Browser';
import util       from '../../../util/common';
import { assert } from 'chai';
import login from '../../../util/common/login';
import elements from '../../../util/common/elements';

export default {
  calculateLUI
};

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


  it( 'should show an error when LUI calculation is wrong', async () => {

    // open a new tab
    const page = await Browser.openTab();

    // ensure a normal user is logged in
    // await login.loginUser (page);

    // Calculate LUI for one setting. Comparison is based on LUI value from plot AEG1
    const value = await calculateLUI( page, 'old components set', 'global', ['HAI', 'SCH'], ['2012', '2013'], 'overall', 'EPs');

    // Check it is the expected LUI value
    assert.equal ( value , '2.34', 'should have same result ');
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
/**
 * Calculate LUI in BEXIS 2
 *
 * @param {Object} page page to work upon
 * @param {String} type allowed values are: old components set, new components set
 * @param {String} regional_global allwoed values are; regional, global
 * @param {Array} exploratories allowed values are: ALB, HAI, SCH
 * @param {Array} years allowed values are: 2006 to (currently) 2018
 * @param {String} seperate_overall allowed values are: separately or overall
 * @param {String} vip_mip_ep allowed values are: VIPs, MIPs, EPs
 */
async function calculateLUI( page, type, regional_global, exploratories, years, seperate_overall, vip_mip_ep){
  // open LUI tool
  await assert.isFulfilled( util.menu.select( page, 'LUI Calculation' ), 'should open the LUI tool' );

  // wait until page is loaded
  await assert.isFulfilled( page.waitForSelector( '#divQuery0', { visible: true }), 'wait for LUI page' );

  // select type of input data (old / new)
  await assert.isFulfilled( page.click( 'input[value="' + type + '"]' ), 'should select new dataset as base input' );

  // select standardized to show table with calculate LUI
  await assert.isFulfilled( page.click( 'input[value="standardized"]' ), 'should select raw data (standardized)' );

  // select regional or global to define how LUI is calculated
  await assert.isFulfilled( page.click( 'input[value="'+ regional_global+ '"]' ), 'should select regional or global' );

  // select all given exploratories
  for (let i=0; i<exploratories.length; i++)
  {
    await assert.isFulfilled( page.click( 'input[data-location="'+ exploratories[i] + '"]' ), 'should select explo(s)' );
  }

  // select all given years
  for (let i=0; i<years.length; i++)
  {
    const year = years[i];
    // find related checkbos
    const checkbox = await page.evaluateHandle( (year) => {
      return document
        .querySelector( `input[value="${year}"] `)
        .parentNode
      ;
    }, year );
    // click in checkbox to select it
    await (await checkbox.asElement()).click();
  }

  // wait for confirm button
  await assert.isFulfilled( page.waitForSelector(  '#btnConfirmSelection', { visible: true }), 'wait for confirm button' );

  // confirm selection
  await assert.isFulfilled( page.click( '#btnConfirmSelection' ), 'should confirm selection' );

  // select type of aggregation (seperatly or overall)
  await assert.isFulfilled( page.click( 'input[value="'+ seperate_overall + '"]' ), 'should select separte or overall' );

  // confirm selection
  await assert.isFulfilled( page.click( 'input[value="'+ vip_mip_ep + '"]' ), 'should select VIP, MIP or EP' );

  // wait for start button
  await assert.isFulfilled( page.waitForSelector(  '#btnCalculateLUI', { visible: true }), 'wait for start calculation' );

  // start LUI calculation
  await assert.isFulfilled( page.click( '#btnCalculateLUI' ), 'shoud start calculation' );

  // wait table is displayed
  await assert.isFulfilled( page.waitForSelector( '.t-status-text', { visible: true }), 'wait for telerik table' );

  // filter table
  await assert.isFulfilled( elements.filterTable_Telerik( page, 'AEG1'), 'should filter table');

  // get value from 7 column (LUI value)
  const result = elements.extractFirstRowNthColumnValue_Telerik( page, 'divResultGrid', '7');

  // returm value
  return await result;
}