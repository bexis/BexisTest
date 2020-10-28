import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import units from './unitElements';
import elements from '../../util/common/elements';

describe('Duplicate Unit', () => {

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
    await assert.isFulfilled(units.deleteUnit(page, util, assert, elements, 'unit.test.name', 'unit.test.desc'), 'should delete the created unit');
  });

  it('should show an error, name and abbreviation already exist', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Manage Units"
    await assert.isFulfilled(util.menu.select(page, 'Manage Units'), 'should open manage units page');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#information-container', { visible: true }), 'wait for manage units page');

    // click Create Unit button
    await assert.isFulfilled(page.click('.bx-button'), 'should click Create Unit button');

    // wait until the unit window is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#UintWindow', { visible: true }), 'wait for create unit form');

    // find Name field
    await assert.isFulfilled(page.type('#Unit_Name', 'unit.test.name'), 'should enter a name');

    // find Abbreviation field
    await assert.isFulfilled(page.type('#Unit_Abbreviation', 'unit.test.abv'), 'should enter an abbreviation');

    // choose a value for Dimension Name
    await assert.isFulfilled(units.chooseDimensionName(page), 'should choose a dimension name');

    // choose a Data Type
    await assert.isFulfilled(units.chooseDataType(page), 'should choose a data type');

    // click save button and wait for the navigation
    await Promise.all([
      page.waitForNavigation(),
      assert.isFulfilled(page.click('#saveButton'), 'should fail to save the unit'),
    ]);

    // check if the unit window is visible
    const isVisible = !!(await page.$('#UintWindow'));
    assert.isTrue(isVisible, 'Create unit form should be visible due to duplication.');

    // check error messages of the create unit window
    // error boxes should contain errors
    const checkErrMsg = await elements.hasErrors(page, '#createUnit .bx-errorMsg');
    assert.isTrue(checkErrMsg, 'should show an error');
  });

  it('should not edit due to duplicate name', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Manage Units"
    await assert.isFulfilled(util.menu.select(page, 'Manage Units'), 'should open manage units page');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#information-container', { visible: true }), 'wait for manage units page');

    const tagContent = await page.evaluate(() => {
      return Array.from(document.getElementsByTagName('td'), element => element.innerText);
    });

    // click edit button
    await assert.isFulfilled(units.editUnit(page, 'unit.test.name'), 'should click edit button');

    // wait until the unit window is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#UintWindow', { visible: true }), 'wait for create unit form');

    // clears Name input field
    await elements.clearInputField(page, '#Unit_Name');

    // type name of the first unit on the table that already exists
    await assert.isFulfilled(page.type('#Unit_Name', tagContent[2].toString()), 'should enter a name');

    // click save button
    await Promise.all([
      page.waitForNavigation(),
      page.click('#saveButton'),
    ]);

    // check if the Create Unit form is visible
    const isVisible = !!(await page.$('#UintWindow'));
    assert.isTrue(isVisible, 'Create unit form should be visible due to duplication.');

    // check error messages of the create unit window
    // error boxes should contain errors
    const checkErrMsg = await elements.hasErrors(page, '#createUnit .bx-errorMsg');
    assert.isTrue(checkErrMsg, 'should show an error - Name already exist');
  });
});