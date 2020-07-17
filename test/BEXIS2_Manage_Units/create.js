/* eslint-disable no-constant-condition */
import Browser    from '../../util/Browser';
import util       from '../../util/common';
import { assert } from 'chai';
import login from '../../util/common/login';

describe( 'Creates Unit', () => {
  createManageUnitTest( 'name' );
  createManageUnitTest( 'abbreviation' );
  createManageUnitTest( 'dimensionName' );
  createManageUnitTest( '' );
});

it( 'should login', async () => {
  // open a new tab
  const page = await Browser.openTab();

  // ensure a normal user is logged in
  await login.loginUser (page);
  await Browser.closeTabs();
});

/**
 * create a test for registration with one field not filled
 *
 * @param   {String}    skipped     field to be left empty
 * @param   {String}    expMsg      expected error message
 */

async function createManageUnitTest(skipped) {
  it( `should show an error when missing ${skipped}`, async () => {

    const page = await Browser.openTab();

    // navigate to "Manage Units"
    await assert.isFulfilled( util.menu.select( page, 'Manage Units' ), 'should open manage units page' );

    await assert.isFulfilled( page.waitForSelector( '#information-container', { visible: true }), 'wait for manage units page' );

    // click Create Unit button
    await assert.isFulfilled( page.click( '.bx-button' ), 'should click "Create Unit" button' );

    // **there is typo in id name. It has to be #UnitWindow instead of #UintWindow**
    await assert.isFulfilled( page.waitForSelector( '#UintWindow', { visible: true }), 'wait for Create Unit form' );

    // find Name input
    if ( !('name' == skipped) ){
      await assert.isFulfilled( page.type( '#Unit_Name', 'sterdian'), 'should enter a name' );
    }

    // find Abbreviation input
    if ( !('abbreviation' == skipped) ){
      await assert.isFulfilled( page.type( '#Unit_Abbreviation', 'sr'), 'should enter an abbreviation' );
    }
    // find Description input
    await assert.isFulfilled( page.type( '#Unit_Description', 'some description'), 'should enter a description' );

    // random number gerenerator for Dimension Name
    const randomDimName = Math.floor(Math.random() * 38) + 1;

    // random number gerenerator for Measurment System
    const randomMeasure = Math.floor(Math.random() * (6 - 2)) + 2;

    // choose a value for Dimension Name
    if ( !('dimensionName' == skipped) ){

      // click dropdown menu for Dimension Name menu
      await assert.isFulfilled( page.click( '#createUnit > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > div > div > span'), 'should open dimension name structure' );

      // choose Dimension Name value
      await assert.isFulfilled( page.click( `body > div.t-animation-container > div > ul > li:nth-child(${randomDimName})`), 'should choose a dimension name' );

      // click dropdown menu for Measurement System menu
      await assert.isFulfilled( page.click('#createUnit > form > table > tbody > tr:nth-child(6) > td:nth-child(2) > div > div'), 'should open measurement system structure');

      // there are more than one of the same class name, so it chooses the first selector
      const selectors = await page.$$(`body > div.t-animation-container > div > ul > li:nth-child(${randomMeasure})`);

      // choose Meausrment System value
      await selectors[1].click();
    }

    // uncheck the chekboxes
    await page.$$eval('input[type="checkbox"]',
                      checkBoxes => checkBoxes
                        .forEach(checkBox => checkBox.checked = false));

    // random number gerenerator for Data Type
    const randomDataType = Math.floor(Math.random() * 7) + 1;

    // choose a datatype
    await assert.isFulfilled( page.click(`#bx-rpm-selectDataTypeGrid > div.t-grid-content > table > tbody > tr:nth-child(${randomDataType}) > td:nth-child(1) > input` ), 'should click the first Data Type from the table' );

    // click save button and wait for the navigation
    await Promise.all([
      page.waitForNavigation(),
      page.click('#saveButton'),
    ]);

    await page.waitFor(2000);

    // close the tab
    await Browser.closeTabs();
  });
}