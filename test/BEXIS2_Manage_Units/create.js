/* eslint-disable no-constant-condition */
import Browser    from '../../util/Browser';
import util       from '../../util/common';
import { assert } from 'chai';
import login from '../../util/common/login';

describe( 'Creates Unit', () => {
  createManageUnitTest( 'unit.test.name' );
  createManageUnitTest( 'unit.test.abv' );
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
 * create a test for Manage Units with required field not filled
 *
 * @param   {String}    skipped     field to be left empty
 */

async function createManageUnitTest(skipped) {
  it( `should show an error when missing ${skipped}`, async () => {

    const page = await Browser.openTab();

    // navigate to "Manage Units"
    await assert.isFulfilled( util.menu.select( page, 'Manage Units' ), 'should open manage units page' );

    await assert.isFulfilled( page.waitForSelector( '#information-container', { visible: true }), 'wait for manage units page' );

    // count the number of rows before a new entry
    const rowCountBefore = (await page.$$('#bx-rpm-unitGrid > table > tbody > tr')).length;

    // click Create Unit button
    await assert.isFulfilled( page.click( '.bx-button' ), 'should click "Create Unit" button' );

    await assert.isFulfilled( page.waitForSelector( '#UintWindow', { visible: true }), 'wait for Create Unit form' );

    // find Name input
    if ( !('unit.test.name' == skipped) ){
      await assert.isFulfilled( page.type( '#Unit_Name', 'unit.test.name'), 'should enter a name' );
    }

    // find Abbreviation input
    if ( !('unit.test.abv' == skipped) ){
      await assert.isFulfilled( page.type( '#Unit_Abbreviation', 'unit.test.abv'), 'should enter an abbreviation' );
    }
    // find Description input
    await assert.isFulfilled( page.type( '#Unit_Description', 'unit.test.desc'), 'should enter a description' );

    // random number gerenerator for Dimension Name
    const randomDimName = Math.floor(Math.random() * 38) + 1;

    // random number gerenerator for Measurment System
    const randomMeasure = Math.floor(Math.random() * (6 - 2)) + 2;

    // choose a value for Dimension Name
    if ( !('dimensionName' == skipped) ){

      // click dropdown menu for Dimension Name menu
      await assert.isFulfilled( page.click( '#createUnit > form > table > tbody > tr:nth-child(4) > td:nth-child(2) > div > div > span'), 'should open dimension name structure' );

      // choose a random Dimension Name value
      await assert.isFulfilled( page.click( `body > div.t-animation-container > div > ul > li:nth-child(${randomDimName})`), 'should choose a dimension name' );

      // click dropdown menu for Measurement System menu
      await assert.isFulfilled( page.click('#createUnit > form > table > tbody > tr:nth-child(6) > td:nth-child(2) > div > div'), 'should open measurement system structure');

      // there are more than one of the same class name, so it chooses the first selector
      const selectors = await page.$$(`body > div.t-animation-container > div > ul > li:nth-child(${randomMeasure})`);

      // choose a random Measurement System value
      await selectors[1].click();
    }

    // uncheck the chekboxes
    await page.$$eval('input[type="checkbox"]',
                      checkBoxes => checkBoxes
                        .forEach(checkBox => checkBox.checked = false));

    // random number gerenerator for Data Type
    const randomDataType = Math.floor(Math.random() * 7) + 1;

    // choose a random Data Type
    await assert.isFulfilled( page.click(`#bx-rpm-selectDataTypeGrid > div.t-grid-content > table > tbody > tr:nth-child(${randomDataType}) > td:nth-child(1) > input` ), 'should click the first Data Type from the table' );

    // click save button and wait for the navigation
    await Promise.all([
      page.waitForNavigation(),
      assert.isFulfilled(page.click('#saveButton'), 'should save the new unit' ),
    ]);

    if ( !('' == skipped) ){
      await Promise.all([
        page.waitForNavigation(),
        assert.isFulfilled(page.click('#UintWindow > div.t-window-titlebar.t-header > div > a > span'), 'should close the create unit page' ),
      ]);
    }

    await assert.isFulfilled( page.waitForSelector( '#bx-rpm-unitGrid > table > tbody > tr', { visible: true }), ' should wait for the table' );

    // count the number of rows before a new entry
    const rowCountAfter = (await page.$$('#bx-rpm-unitGrid > table > tbody > tr')).length;

    // find difference between rows
    const diffRows = rowCountAfter - rowCountBefore;

    // checks if a new entry is added or not
    if ( diffRows === 0 ) {
      assert.equal(rowCountBefore, rowCountAfter, 'No new entry is added');
    } else if ( diffRows === 1) {
      assert.notEqual(rowCountBefore, rowCountAfter, 'New entry is added');
    }
  });
}