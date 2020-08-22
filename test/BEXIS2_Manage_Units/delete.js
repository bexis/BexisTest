import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import units from './unitElements';

describe('Delete Unit', () => {

  // before starting the testing, create a new unit
  before(async () => {

    await assert.isFulfilled(units.createUnit(Browser, util, units, assert, 'unit.test.desc'), 'should create a new unit');
  });

  deleteUnitTest('cancel');
  deleteUnitTest('confirm');

  //TODO: Add this functionality to Lock Unit by Variable
  it('should not delete the unit in use', async () => {

    const page = await Browser.openTab();

    // navigate to "Manage Units"
    await assert.isFulfilled(util.menu.select(page, 'Manage Units'), 'should open manage units page');

    // wait until the container is loaded in view mode
    await assert.isFulfilled(page.waitForSelector('#information-container', { visible: true }), 'wait for manage units page');

    // click a disabled button
    await assert.isFulfilled(page.click('#bx-rpm-unitGrid > table > tbody > tr:nth-child(5) > td:nth-child(8) > div > div.bx.bx-grid-function.bx-trash.bx-disabled'), 'should click a disabled delete button');
  });
});

/**
 * delete and don't delete the filtered unit
 *
 * @param   {String}    action     action message
 */

async function deleteUnitTest(action) {
  it(`should ${action} deletion of the unit`, async () => {

    const page = await Browser.openTab();

    // filter unit description in the table
    await assert.isFulfilled(units.filterDescription(page, util, 'unit.test.desc'), 'should filter the unit description');

    // after clicking delete icon alert box is shown -> click Cancel
    if ('cancel' == action) {
      page.on('dialog', async dialog => { await dialog.dismiss(); });
    }

    // after clicking delete icon alert box is shown -> click Ok
    if ('confirm' == action) {
      page.on('dialog', async dialog => { await dialog.accept(); });
    }

    // click the Delete icon to delete the unit
    await assert.isFulfilled(page.click('#bx-rpm-unitGrid > table > tbody > tr > td:nth-child(8) > div > a.bx.bx-grid-function.bx-trash'), 'should click the delete icon');

    // filter unit description in the table, after the deletion process
    await assert.isFulfilled(units.filterDescription(page, util, 'unit.test.desc'), 'should filter the unit description');

    // get the table content
    const tableContent = await units.returnTableContent(page);

    let elementContent = (content) => {
      return tableContent.includes(content);
    };

    // check if the deletion happened or not
    if ('cancel' == action) {
      assert.isTrue(elementContent('unit.test.desc'), 'The unit should be on the table.');
    } else if ('deletion' == action) {
      assert.isTrue(elementContent('No records to display.'), 'The unit should not be on the table.');
    }
  });
}