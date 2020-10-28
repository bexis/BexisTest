import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import units from './unitElements';

describe('Create Unit', () => {

  after(async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    //deletes a unit
    await assert.isFulfilled(units.deleteUnit(page, util, assert, elements, 'unit.test.name', 'unit.test.desc'), 'should delete the created unit');
  });

  createUnitTest('unit.test.name');
  createUnitTest('unit.test.abv');
  createUnitTest('dimensionName');

  it('should create a new unit', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    //creates a unit
    await assert.isFulfilled(units.createUnit(page, util, units, assert, elements, 'unit.test.desc'), 'should create a new unit');
  });
});

/**
 * create a test for Manage Units with required field not filled until all fields filled
 *
 * @param   {String}    skipped     field to be left empty
 */

async function createUnitTest(skipped) {
  it(`should show an error when missing ${skipped}`, async () => {

    const page = await Browser.openTab();
    try {
      // make sure we are logged in
      if( !(await util.login.isLoggedIn(page)) ) {
        await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
      }

      // navigate to "Manage Units"
      await assert.isFulfilled(util.menu.select(page, 'Manage Units'), 'should open manage units page');

      // wait until the container is loaded in view mode
      await assert.isFulfilled(page.waitForSelector('#information-container', { visible: true }), 'wait for manage units page');

      // click Create Unit button
      await assert.isFulfilled(page.click('.bx-button'), 'should click create unit button');

      // wait until the unit window is loaded in view mode
      await assert.isFulfilled(page.waitForSelector('#UintWindow', { visible: true }), 'wait for create unit form');

      // find Name field
      if (!('unit.test.name' == skipped)) {
        await assert.isFulfilled(page.type('#Unit_Name', 'unit.test.name'), 'should enter a name');
      }

      // find Abbreviation field
      if (!('unit.test.abv' == skipped)) {
        await assert.isFulfilled(page.type('#Unit_Abbreviation', 'unit.test.abv'), 'should enter an abbreviation');
      }

      // find Description field
      await assert.isFulfilled(page.type('#Unit_Description', 'unit.test.desc'), 'should enter a description');

      // choose a value for Dimension Name
      if (!('dimensionName' == skipped)) {
        await assert.isFulfilled(units.chooseDimensionName(page), 'should choose a dimension name');
      }

      // choose a Data Type
      await assert.isFulfilled(units.chooseDataType(page), 'should choose a data type');

      // click save button and wait for the navigation
      await Promise.all([
        page.waitForNavigation(),
        assert.isFulfilled(page.click('#saveButton'), 'should fail to save the unit'),
      ]);

      // wait until the unit window is loaded in view mode
      await assert.isFulfilled(page.waitForSelector('#UintWindow', { visible: true }), 'wait for create unit form');

      // check if the unit window is visible
      const isVisible = !!(await page.$('#UintWindow'));
      assert.isTrue(isVisible, 'Create unit form should be visible due to missing required field.');

      // check error messages of the create unit window
      // error boxes should contain errors
      const checkErrMsg = await elements.hasErrors(page, '#createUnit .bx-errorMsg');
      assert.isTrue(checkErrMsg, 'should show an error');

      // check for an entry by Description Name in the list of units
      const checkEntry = await elements.hasEntry(page, '#bx-rpm-unitGrid  > table > tbody > tr', 'unit.test.desc', '7');
      assert.isFalse(checkEntry, 'should not contain the unit in the table');

    } catch(e) {
      await page.screenshot({path: `./test/BEXIS2_Manage_Units/${skipped}Error.png`});
      throw e;
    }
  });
}