import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import elements from '../../util/common/elements';
import units from './unitElements';

describe('Delete Unit', () => {

  before(async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    //creates a unit
    await assert.isFulfilled(units.createUnit(page, util, units, assert, elements, 'unit.test.desc'), 'should create a new unit');
  });

  deleteUnitTest('cancel');
  deleteUnitTest('confirm');
});

/**
 * delete and don't delete the filtered unit
 *
 * @param   {String}    action     action message
 */

async function deleteUnitTest(action) {
  it(`should ${action} deletion of the unit`, async () => {

    const page = await Browser.openTab();

    // make sure we are logged in
    if( !(await util.login.isLoggedIn(page)) ) {
      await assert.isFulfilled( util.login.loginUser(page), 'should log in' );
    }

    // navigate to "Manage Units"
    await assert.isFulfilled(util.menu.select(page, 'Manage Units'), 'should open manage units page');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#information-container', { visible: true }), 'wait for manage units page');

    // after clicking delete button. alert box is shown -> click Cancel
    if ('cancel' == action) {
      page.on('dialog', async dialog => { await dialog.dismiss(); });
    }

    // after clicking delete button, alert box is shown -> click Ok
    if ('confirm' == action) {
      page.on('dialog', async dialog => { await dialog.accept(); });
    }

    // click Delete button
    const deleteButton = await page.$$(('a[title*="unit.test.name"]'));
    await deleteButton[1].click();

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#information-container', { visible: true }), 'wait for manage units page');

    // check for an entry by Description Name in the list of units
    let checkEntry = await elements.hasEntry(page, '#bx-rpm-unitGrid  > table > tbody > tr', 'unit.test.desc', '7');

    // check if the deletion happened or not
    if ('cancel' == action) {
      assert.isTrue(checkEntry, 'should contain the unit in the table');
    } else if ('confirm' == action) {
      assert.isFalse(checkEntry, 'should not contain the unit in the table');
    }
  });
}