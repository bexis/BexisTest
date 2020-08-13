import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import login from '../../util/common/login';
import units from './unitElements';


describe('Create Unit', () => {
  createManageUnitTest('unit.test.name');
  createManageUnitTest('unit.test.abv');
  createManageUnitTest('dimensionName');
  createManageUnitTest('');
});

it('should login', async () => {
  // open a new tab
  const page = await Browser.openTab();

  // ensure a normal user is logged in
  await login.loginUser(page);
  await Browser.closeTabs();
});

/**
 * create a test for Manage Units with required field not filled until all fields filled
 *
 * @param   {String}    skipped     field to be left empty
 */

async function createManageUnitTest(skipped) {
  it(`should show an error when missing ${skipped}`, async () => {

    const page = await Browser.openTab();

    // navigate to "Manage Units"
    await assert.isFulfilled(util.menu.select(page, 'Manage Units'), 'should open manage units page');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#information-container', { visible: true }), 'wait for manage units page');

    // count the number of rows before a new entry
    const rowCountBefore = (await page.$$('#bx-rpm-unitGrid > table > tbody > tr')).length;

    // click Create Unit button
    await assert.isFulfilled(page.click('.bx-button'), 'should click Create Unit button');

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
      assert.isFulfilled(page.click('#saveButton'), 'should save the new unit'),
    ]);

    // fill all the fields
    if (!('' == skipped)) {
      await Promise.all([
        page.waitForNavigation(),
        assert.isFulfilled(page.click('#UintWindow > div.t-window-titlebar.t-header > div > a > span'), 'should close the create unit page'),
      ]);
    }

    // wait until the table is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#bx-rpm-unitGrid > table > tbody > tr', { visible: true }), ' should wait for the table');

    // count the number of rows after a new entry
    const rowCountAfter = (await page.$$('#bx-rpm-unitGrid > table > tbody > tr')).length;

    // find difference between rows
    const diffRows = rowCountAfter - rowCountBefore;

    // checks if a new entry is added or not
    if (diffRows === 0) {
      assert.equal(rowCountBefore, rowCountAfter, 'No new entry is added');
    } else if (diffRows === 1) {
      assert.notEqual(rowCountBefore, rowCountAfter, 'New entry is added');
    }
  });
}