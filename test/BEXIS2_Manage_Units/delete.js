import Browser from '../../util/Browser';
import util from '../../util/common';
import { assert } from 'chai';
import units from './unitElements';

require('./edit.js');

describe('Delete Unit', () => {
  deleteUnit('not ');
  deleteUnit('');

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

async function deleteUnit(action) {
  it(`should ${action}delete the unit`, async () => {

    const page = await Browser.openTab();

    // filter unit description in the table
    await assert.isFulfilled(units.filterDescription(page, util));

    // after clicking delete icon alert box is shown -> click Cancel
    if ('not ' == action) {
      page.on('dialog', async dialog => { await dialog.dismiss(); });
    }

    // after clicking delete icon alert box is shown -> click Ok
    if ('' == action) {
      page.on('dialog', async dialog => { await dialog.accept(); });
    }

    // click the Delete icon to delete the unit
    await assert.isFulfilled(page.click('#bx-rpm-unitGrid > table > tbody > tr > td:nth-child(8) > div > a.bx.bx-grid-function.bx-trash'), 'should click the delete icon');
  });
}