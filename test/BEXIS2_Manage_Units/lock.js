import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import units from './unitElements';

describe('Lock Unit', () => {

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

  it('should lock a non-locked unit', async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Manage Variable Templates"
    await assert.isFulfilled(util.menu.select(page, 'Manage Variable Templates'), 'should open manage variable templates page');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#informationContainer', { visible: true }), 'wait for manage variable templates page');

    // click Create Variable Template button
    await assert.isFulfilled(page.click('body > div.main-content.container-fluid > table > tbody > tr > td > div > div.bx-rpm-buttons > a'), 'should click create variable template button');

    // wait template window is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#AttributeWindow', { visible: true }), 'wait for create variable template form');

    // find Name field
    await assert.isFulfilled(page.type('#Name', 'temp.test.name'), 'should enter a template name');

    // find Unit field
    await assert.isFulfilled(page.type('#unitId', 'unit.test.name'), 'should enter a unit name');

    // find Description field
    await assert.isFulfilled(page.type('#Description', 'unit.test.desc'), 'should enter a description');

    // click Save button
    await assert.isFulfilled(page.click('#saveButton'), 'should save the new template');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#informationContainer', { visible: true }), 'wait for manage variable templates page');

    // navigate to "Manage Units"
    await assert.isFulfilled(util.menu.select(page, 'Manage Units'), 'should open manage units page');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#information-container', { visible: true }), 'wait for manage units page');

    // filter unit description in the table
    await assert.isFulfilled(units.filterDescription(page, util, 'Manage Units', '#information-container', '#bx-rpm-unitGrid', 'unit.test.desc'), 'should filter the unit description');

    // check if there is a disabled class on the table or not
    const disabledButton = await page.evaluate(() => {
      return (document.querySelector('.bx-disabled') != null) ? true : false;
    });

    // assertion is true if the Delete button is disabled
    assert.isTrue(disabledButton, 'The unit has to be locked.');

    // navigate to "Manage Variable Templates"
    await assert.isFulfilled(util.menu.select(page, 'Manage Variable Templates'), 'should open manage variable templates page');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#informationContainer', { visible: true }), 'wait for manage variable templates page');

    // after clicking delete icon alert box is shown -> click Ok
    page.on('dialog', async dialog => { await dialog.accept(); });

    // click Delete button
    const deleteButton = await page.$$(('a[title*="temp.test.name"]'));
    await assert.isFulfilled(deleteButton[1].click(), 'should click the delete button');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#informationContainer', { visible: true }), 'wait for manage variable templates page');

    // check for an entry by Name in the list of variable templates
    const checkEntry = await elements.hasEntry(page, '#bx-rpm-attributeGrid > table > tbody > tr', 'temp.test.name', '2');
    assert.isFalse(checkEntry, 'should not contain the template in the table');
  });
});
