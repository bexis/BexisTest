import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import units from './unitElements';

describe('Edit Unit', () => {

  before(async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    //creates a unit
    await assert.isFulfilled(units.createUnit(page, util, units, assert, elements, 'unit.test.desc'), 'should create a new unit');
  });

  after(async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    //deletes a unit
    await assert.isFulfilled(units.deleteUnit(page, util, assert, elements, 'new.unit.test.name', 'unit.test.desc'), 'should delete the created unit');
  });

  it('should edit the unit', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Manage Units"
    await assert.isFulfilled(util.menu.select(page, 'Manage Units'), 'should open manage units page');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#information-container', { visible: true }), 'wait for manage units page');

    // click edit button
    await assert.isFulfilled(units.editUnit(page, 'unit.test.name'), 'should click edit button');

    // wait until the unit window is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#UintWindow', { visible: true }), 'wait for create unit form');

    // edit Name
    await assert.isFulfilled(page.type('#Unit_Name', 'new.'), 'should edit the name');

    // edit Abbreviation
    await assert.isFulfilled(page.type('#Unit_Abbreviation', 'new.'), 'should edit the abbreviation');

    // choose a Dimension Name
    await assert.isFulfilled(units.chooseDimensionName(page), 'should choose a new dimension name');

    // choose a Data Type
    await assert.isFulfilled(units.chooseDataType(page), 'should choose a new data type');

    // click save button and wait for the navigation
    await Promise.all([
      page.waitForNavigation(),
      page.click('#saveButton'),
    ]);

    // wait until the table is loaded in view mode
    await page.waitForSelector('#bx-rpm-unitGrid > table > tbody > tr', { visible: true });

    // check for an entry by Description Name in the list of units
    const checkEntry = await elements.hasEntry(page, '#bx-rpm-unitGrid  > table > tbody > tr', 'unit.test.desc', '7');
    assert.isTrue(checkEntry, 'should contain the unit in the table');
  });
});